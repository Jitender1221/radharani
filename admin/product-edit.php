<?php require_once('header.php'); ?>
<?php require_once('./inc/config.php'); ?>

<?php
if (!isset($_REQUEST['id'])) {
    header('location: logout.php');
    exit;
}

$error_message = '';
$success_message = '';

if (isset($_POST['form1'])) {
    $valid = 1;

    if (empty($_POST['tcat_id'])) {
        $valid = 0;
        $error_message .= "You must select a top level category<br>";
    }

    if (empty($_POST['mcat_id'])) {
        $valid = 0;
        $error_message .= "You must select a mid level category<br>";
    }

    if (empty($_POST['ecat_id'])) {
        $valid = 0;
        $error_message .= "You must select an end level category<br>";
    }

    if (empty($_POST['p_name'])) {
        $valid = 0;
        $error_message .= "Product name cannot be empty<br>";
    }

    if (empty($_POST['p_current_price'])) {
        $valid = 0;
        $error_message .= "Current Price cannot be empty<br>";
    }

    if (empty($_POST['p_qty'])) {
        $valid = 0;
        $error_message .= "Quantity cannot be empty<br>";
    }

    $path = $_FILES['p_featured_photo']['name'] ?? '';
    $path_tmp = $_FILES['p_featured_photo']['tmp_name'] ?? '';

    if ($path != '') {
        $ext = pathinfo($path, PATHINFO_EXTENSION);
        if (!in_array(strtolower($ext), ['jpg', 'jpeg', 'png', 'gif'])) {
            $valid = 0;
            $error_message .= "Only jpg, jpeg, png, or gif files are allowed<br>";
        }
    }

    if ($valid == 1) {
        // Upload additional gallery photos
        if (!empty($_FILES['photo']['name']) && !empty($_FILES['photo']['tmp_name'])) {
            $photo = array_filter($_FILES['photo']['name']);
            $photo_temp = array_filter($_FILES['photo']['tmp_name']);

            $statement = $pdo->prepare("SHOW TABLE STATUS LIKE 'tbl_product_photo'");
            $statement->execute();
            $row = $statement->fetch(PDO::FETCH_ASSOC);
            $next_id1 = $row['Auto_increment'];
            $z = $next_id1;

            foreach ($photo as $i => $p_name) {
                $ext1 = pathinfo($p_name, PATHINFO_EXTENSION);
                if (in_array(strtolower($ext1), ['jpg', 'jpeg', 'png', 'gif'])) {
                    $final_name1 = $z . '.' . $ext1;
                    move_uploaded_file($photo_temp[$i], "../assets/uploads/product_photos/" . $final_name1);
                    $stmt = $pdo->prepare("INSERT INTO tbl_product_photo (photo, p_id) VALUES (?, ?)");
                    $stmt->execute([$final_name1, $_REQUEST['id']]);
                    $z++;
                }
            }
        }

        // Update main product info
        if ($path == '') {
            $stmt = $pdo->prepare("UPDATE tbl_product SET 
                p_name=?, p_old_price=?, p_current_price=?, p_qty=?,
                p_description=?, p_short_description=?, p_feature=?,
                p_condition=?, p_return_policy=?, p_is_featured=?, p_is_active=?, ecat_id=?
                WHERE p_id=?");

            $stmt->execute([
                $_POST['p_name'], $_POST['p_old_price'], $_POST['p_current_price'], $_POST['p_qty'],
                $_POST['p_description'], $_POST['p_short_description'], $_POST['p_feature'],
                $_POST['p_condition'], $_POST['p_return_policy'], $_POST['p_is_featured'],
                $_POST['p_is_active'], $_POST['ecat_id'], $_REQUEST['id']
            ]);
        } else {
            $old_file_path = '../assets/uploads/' . $_POST['current_photo'];
            if (file_exists($old_file_path)) {
                unlink($old_file_path);
            }
            $final_name = 'product-featured-' . $_REQUEST['id'] . '.' . $ext;
            move_uploaded_file($path_tmp, '../assets/uploads/' . $final_name);

            $stmt = $pdo->prepare("UPDATE tbl_product SET 
                p_name=?, p_old_price=?, p_current_price=?, p_qty=?,
                p_featured_photo=?, p_description=?, p_short_description=?,
                p_feature=?, p_condition=?, p_return_policy=?, p_is_featured=?,
                p_is_active=?, ecat_id=? WHERE p_id=?");

            $stmt->execute([
                $_POST['p_name'], $_POST['p_old_price'], $_POST['p_current_price'], $_POST['p_qty'],
                $final_name, $_POST['p_description'], $_POST['p_short_description'],
                $_POST['p_feature'], $_POST['p_condition'], $_POST['p_return_policy'],
                $_POST['p_is_featured'], $_POST['p_is_active'], $_POST['ecat_id'], $_REQUEST['id']
            ]);
        }

        // Sizes
        $pdo->prepare("DELETE FROM tbl_product_size WHERE p_id=?")->execute([$_REQUEST['id']]);
        if (!empty($_POST['size'])) {
            foreach ($_POST['size'] as $value) {
                $pdo->prepare("INSERT INTO tbl_product_size (size_id, p_id) VALUES (?, ?)")->execute([$value, $_REQUEST['id']]);
            }
        }

        // Colors
        $pdo->prepare("DELETE FROM tbl_product_color WHERE p_id=?")->execute([$_REQUEST['id']]);
        if (!empty($_POST['color'])) {
            foreach ($_POST['color'] as $value) {
                $pdo->prepare("INSERT INTO tbl_product_color (color_id, p_id) VALUES (?, ?)")->execute([$value, $_REQUEST['id']]);
            }
        }

        $success_message = 'Product updated successfully.';
    }
}

// Fetch product
$statement = $pdo->prepare("SELECT * FROM tbl_product WHERE p_id=?");
$statement->execute([$_REQUEST['id']]);
if ($statement->rowCount() == 0) {
    header('location: logout.php');
    exit;
}
$row = $statement->fetch(PDO::FETCH_ASSOC);
extract($row);

// Category hierarchy
$stmt = $pdo->prepare("SELECT * FROM tbl_end_category t1
                      JOIN tbl_mid_category t2 ON t1.mcat_id = t2.mcat_id
                      JOIN tbl_top_category t3 ON t2.tcat_id = t3.tcat_id
                      WHERE t1.ecat_id=?");
$stmt->execute([$ecat_id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
$mcat_id = $row['mcat_id'] ?? '';
$tcat_id = $row['tcat_id'] ?? '';

// Sizes
$stmt = $pdo->prepare("SELECT * FROM tbl_product_size WHERE p_id=?");
$stmt->execute([$_REQUEST['id']]);
$sizes = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

// Colors
$stmt = $pdo->prepare("SELECT * FROM tbl_product_color WHERE p_id=?");
$stmt->execute([$_REQUEST['id']]);
$colors = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
?>


<section class="content">
    <div class="row">
        <div class="col-md-12">

            <?php if (!empty($error_message)): ?>
            <div class="callout callout-danger">
                <p><?= htmlspecialchars($error_message); ?></p>
            </div>
            <?php endif; ?>

            <?php if (!empty($success_message)): ?>
            <div class="callout callout-success">
                <p><?= htmlspecialchars($success_message); ?></p>
            </div>
            <?php endif; ?>

            <form class="form-horizontal" action="" method="post" enctype="multipart/form-data">
                <div class="box box-info">
                    <div class="box-body">

                        <!-- Top Level Category -->
                        <div class="form-group">
                            <label class="col-sm-3 control-label">Top Level Category Name <span>*</span></label>
                            <div class="col-sm-4">
                                <select name="tcat_id" class="form-control select2 top-cat">
                                    <option value="">Select Top Level Category</option>
                                    <?php
                                    $stmt = $pdo->query("SELECT * FROM tbl_top_category ORDER BY tcat_name ASC");
                                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                                        $selected = (isset($tcat_id) && $row['tcat_id'] == $tcat_id) ? 'selected' : '';
                                        echo "<option value=\"{$row['tcat_id']}\" $selected>{$row['tcat_name']}</option>";
                                    }
                                    ?>
                                </select>
                            </div>
                        </div>

                        <!-- Mid Level Category -->
                        <div class="form-group">
                            <label class="col-sm-3 control-label">Mid Level Category Name <span>*</span></label>
                            <div class="col-sm-4">
                                <select name="mcat_id" class="form-control select2 mid-cat">
                                    <option value="">Select Mid Level Category</option>
                                    <?php
                                    if (!empty($tcat_id)) {
                                        $stmt = $pdo->prepare("SELECT * FROM tbl_mid_category WHERE tcat_id = ? ORDER BY mcat_name ASC");
                                        $stmt->execute([$tcat_id]);
                                        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                                            $selected = (isset($mcat_id) && $row['mcat_id'] == $mcat_id) ? 'selected' : '';
                                            echo "<option value=\"{$row['mcat_id']}\" $selected>{$row['mcat_name']}</option>";
                                        }
                                    }
                                    ?>
                                </select>
                            </div>
                        </div>

                        <!-- End Level Category -->
                        <div class="form-group">
                            <label class="col-sm-3 control-label">End Level Category Name <span>*</span></label>
                            <div class="col-sm-4">
                                <select name="ecat_id" class="form-control select2 end-cat">
                                    <option value="">Select End Level Category</option>
                                    <?php
                                    if (!empty($mcat_id)) {
                                        $stmt = $pdo->prepare("SELECT * FROM tbl_end_category WHERE mcat_id = ? ORDER BY ecat_name ASC");
                                        $stmt->execute([$mcat_id]);
                                        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                                            $selected = (isset($ecat_id) && $row['ecat_id'] == $ecat_id) ? 'selected' : '';
                                            echo "<option value=\"{$row['ecat_id']}\" $selected>{$row['ecat_name']}</option>";
                                        }
                                    }
                                    ?>
                                </select>
                            </div>
                        </div>

                        <!-- Product Name -->
                        <div class="form-group">
                            <label class="col-sm-3 control-label">Product Name <span>*</span></label>
                            <div class="col-sm-4">
                                <input type="text" name="p_name" class="form-control"
                                    value="<?= isset($p_name) ? htmlspecialchars($p_name) : ''; ?>">
                            </div>
                        </div>

                        <!-- Old and Current Price -->
                        <div class="form-group">
                            <label class="col-sm-3 control-label">Old Price <span style="font-size:10px;">(In
                                    USD)</span></label>
                            <div class="col-sm-4">
                                <input type="text" name="p_old_price" class="form-control"
                                    value="<?= isset($p_old_price) ? htmlspecialchars($p_old_price) : ''; ?>">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-sm-3 control-label">Current Price <span>*</span> <span
                                    style="font-size:10px;">(In USD)</span></label>
                            <div class="col-sm-4">
                                <input type="text" name="p_current_price" class="form-control"
                                    value="<?= isset($p_current_price) ? htmlspecialchars($p_current_price) : ''; ?>">
                            </div>
                        </div>

                        <!-- Quantity -->
                        <div class="form-group">
                            <label class="col-sm-3 control-label">Quantity <span>*</span></label>
                            <div class="col-sm-4">
                                <input type="text" name="p_qty" class="form-control"
                                    value="<?= isset($p_qty) ? htmlspecialchars($p_qty) : ''; ?>">
                            </div>
                        </div>

                        <!-- Sizes -->
                        <div class="form-group">
                            <label class="col-sm-3 control-label">Select Size</label>
                            <div class="col-sm-4">
                                <select name="size[]" class="form-control select2" multiple="multiple">
                                    <?php
                                    $stmt = $pdo->query("SELECT * FROM tbl_size ORDER BY size_id ASC");
                                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                                        $selected = (isset($size_id) && in_array($row['size_id'], $size_id)) ? 'selected' : '';
                                        echo "<option value=\"{$row['size_id']}\" $selected>{$row['size_name']}</option>";
                                    }
                                    ?>
                                </select>
                            </div>
                        </div>

                        <!-- Colors -->
                        <div class="form-group">
                            <label class="col-sm-3 control-label">Select Color</label>
                            <div class="col-sm-8">
                                <div class="row">
                                    <?php
                                    $stmt = $pdo->query("SELECT * FROM tbl_color ORDER BY color_code ASC");
                                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                                        $color_id = $row['color_id'];
                                        $color_code = $row['color_code'];
                                        $shape = $row['shape'];
                                        $border_radius = $shape === 'circle' ? '50%' : '0';
                                        echo <<<HTML
                                        <div class="col-md-2 text-center mb-2">
                                            <label style="cursor:pointer;">
                                                <div style="width:30px; height:30px; background:$color_code; border:1px solid #888; border-radius:$border_radius; margin:auto;"></div>
                                                <input type="checkbox" name="color[]" value="$color_id" style="margin-top:5px;">
                                                <div style="font-size:12px;">{$shape}</div>
                                            </label>
                                        </div>
HTML;
                                    }
                                    ?>
                                </div>
                            </div>
                        </div>

                        <!-- Existing Photo -->
                        <?php if (!empty($p_featured_photo)): ?>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">Existing Featured Photo</label>
                            <div class="col-sm-4">
                                <img src="../assets/uploads/<?= htmlspecialchars($p_featured_photo); ?>"
                                    style="width:150px;">
                                <input type="hidden" name="current_photo"
                                    value="<?= htmlspecialchars($p_featured_photo); ?>">
                            </div>
                        </div>
                        <?php endif; ?>

                        <!-- Change Photo -->
                        <div class="form-group">
                            <label class="col-sm-3 control-label">Change Featured Photo</label>
                            <div class="col-sm-4"><input type="file" name="p_featured_photo"></div>
                        </div>

                        <!-- Other Photos -->
                        <div class="form-group">
                            <label class="col-sm-3 control-label">Other Photos</label>
                            <div class="col-sm-4">
                                <table id="ProductTable" style="width:100%;">
                                    <tbody>
                                        <?php
                                    if (!empty($_REQUEST['id'])) {
                                        $stmt = $pdo->prepare("SELECT * FROM tbl_product_photo WHERE p_id = ?");
                                        $stmt->execute([$_REQUEST['id']]);
                                        foreach ($stmt as $row) {
                                            echo "<tr>
                                                <td><img src='../assets/uploads/product_photos/{$row['photo']}' style='width:150px;margin-bottom:5px;'></td>
                                                <td style='width:28px;'><a onclick='return confirm(\"Delete this photo?\");' href='product-other-photo-delete.php?id={$row['pp_id']}&id1={$_REQUEST['id']}' class='btn btn-danger btn-xs'>X</a></td>
                                            </tr>";
                                        }
                                    }
                                    ?>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-sm-2">
                                <input type="button" id="btnAddNew" value="Add Item" class="btn btn-warning btn-xs"
                                    style="margin-top: 5px;margin-bottom:10px;">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Description</label>
                            <div class="col-sm-8">
                                <textarea name="p_description" class="form-control" cols="30" rows="10"
                                    id="editor1"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Short Description</label>
                            <div class="col-sm-8">
                                <textarea name="p_short_description" class="form-control" cols="30" rows="10"
                                    id="editor2"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Features</label>
                            <div class="col-sm-8">
                                <textarea name="p_feature" class="form-control" cols="30" rows="10"
                                    id="editor3"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Conditions</label>
                            <div class="col-sm-8">
                                <textarea name="p_condition" class="form-control" cols="30" rows="10"
                                    id="editor4"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Return Policy</label>
                            <div class="col-sm-8">
                                <textarea name="p_return_policy" class="form-control" cols="30" rows="10"
                                    id="editor5"></textarea>
                            </div>
                        </div>

                        <!-- Featured and Active -->
                        <div class="form-group">
                            <label class="col-sm-3 control-label">Is Featured?</label>
                            <div class="col-sm-4">
                                <select name="p_is_featured" class="form-control" style="width:auto;">
                                    <option value="0" <?= ($p_is_featured == '0') ? 'selected' : ''; ?>>No</option>
                                    <option value="1" <?= ($p_is_featured == '1') ? 'selected' : ''; ?>>Yes</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">Is Active?</label>
                            <div class="col-sm-4">
                                <select name="p_is_active" class="form-control" style="width:auto;">
                                    <option value="0" <?= ($p_is_active == '0') ? 'selected' : ''; ?>>No</option>
                                    <option value="1" <?= ($p_is_active == '1') ? 'selected' : ''; ?>>Yes</option>
                                </select>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="form-group">
                            <label class="col-sm-3 control-label"></label>
                            <div class="col-sm-6">
                                <button type="submit" class="btn btn-success" name="form1">Update</button>
                            </div>
                        </div>

                    </div>
                </div>
            </form>

        </div>
    </div>
</section>

<?php require_once('footer.php'); ?>