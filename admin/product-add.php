<?php require_once('header.php'); ?>
<?php
$error_message = '';
$success_message = '';

if (isset($_POST['form1'])) {
    $valid = 1;

    // Validation
    if (empty($_POST['tcat_id'])) {
        $valid = 0;
        $error_message .= "Select a top level category<br>";
    }
    if (empty($_POST['mcat_id'])) {
        $valid = 0;
        $error_message .= "Select a mid level category<br>";
    }
    if (empty($_POST['ecat_id'])) {
        $valid = 0;
        $error_message .= "Select an end level category<br>";
    }
    if (empty($_POST['p_name'])) {
        $valid = 0;
        $error_message .= "Product name is required<br>";
    }
    if (empty($_POST['p_current_price'])) {
        $valid = 0;
        $error_message .= "Current price is required<br>";
    }
    if (empty($_POST['p_qty'])) {
        $valid = 0;
        $error_message .= "Quantity is required<br>";
    }


    // Featured Photo
    $path = $_FILES['p_featured_photo']['name'] ?? '';
    $path_tmp = $_FILES['p_featured_photo']['tmp_name'] ?? '';

    $final_name = '';

if (isset($_FILES['p_featured_photo']) && $_FILES['p_featured_photo']['name'] != '') {
    // Delete old photo if exists
    if (isset($_POST['current_photo']) && !empty($_POST['current_photo'])) {
        $oldPhoto = '../assets/uploads/' . $_POST['current_photo'];
        if (file_exists($oldPhoto) && is_file($oldPhoto)) {
            unlink($oldPhoto);
        }
    }

    // Upload new photo
    $newPhoto = $_FILES['p_featured_photo']['name'];
    $newPhotoTmp = $_FILES['p_featured_photo']['tmp_name'];
    $ext = strtolower(pathinfo($newPhoto, PATHINFO_EXTENSION));
    $newFileName = 'product-featured-' . time() . '.' . $ext;

    move_uploaded_file($newPhotoTmp, '../assets/uploads/' . $newFileName);

    // Save $newFileName in DB
}


    if ($path != '') {
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (!in_array($ext, ['jpg', 'jpeg', 'png', 'gif'])) {
            $valid = 0;
            $error_message .= 'Invalid file type. Only jpg, jpeg, png, gif allowed.<br>';
        } else {
            $statement = $pdo->query("SHOW TABLE STATUS LIKE 'tbl_product'");
            $ai_id = $statement->fetch()['Auto_increment'];
            $final_name = 'product-featured-' . $ai_id . '.' . $ext;
            move_uploaded_file($path_tmp, '../assets/uploads/' . $final_name);
        }
    }

    if ($valid == 1) {
        // Insert product
        $stmt = $pdo->prepare("INSERT INTO tbl_product (
            p_name, p_old_price, p_current_price, p_qty, p_featured_photo,
            p_description, p_short_description, p_feature, p_condition, p_return_policy,
            p_total_view, p_is_featured, p_is_active, ecat_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->execute([
            $_POST['p_name'],
            $_POST['p_old_price'] ?? null,
            $_POST['p_current_price'],
            $_POST['p_qty'],
            $final_name ?: null, // allow NULL in DB if no image
            $_POST['p_description'] ?? '',
            $_POST['p_short_description'] ?? '',
            $_POST['p_feature'] ?? '',
            $_POST['p_condition'] ?? '',
            $_POST['p_return_policy'] ?? '',
            0,
            $_POST['p_is_featured'] ?? 0,
            $_POST['p_is_active'] ?? 1,
            $_POST['ecat_id']
        ]);

        $p_id = $pdo->lastInsertId();

        // Additional photos
        if (!empty($_FILES['photo']['name'][0])) {
            foreach ($_FILES['photo']['name'] as $i => $photo_name) {
                $tmp_name = $_FILES['photo']['tmp_name'][$i];
                $ext2 = strtolower(pathinfo($photo_name, PATHINFO_EXTENSION));
                if (in_array($ext2, ['jpg', 'jpeg', 'png', 'gif'])) {
                    $stmt = $pdo->query("SHOW TABLE STATUS LIKE 'tbl_product_photo'");
                    $photo_id = $stmt->fetch()['Auto_increment'];
                    $final_photo = $photo_id . '.' . $ext2;
                    move_uploaded_file($tmp_name, '../assets/uploads/product_photos/' . $final_photo);
                    $pdo->prepare("INSERT INTO tbl_product_photo (photo, p_id) VALUES (?, ?)")
                        ->execute([$final_photo, $p_id]);
                }
            }
        }

        // Product Sizes
        if (!empty($_POST['size'])) {
            foreach ($_POST['size'] as $size_id) {
                $pdo->prepare("INSERT INTO tbl_product_size (size_id, p_id) VALUES (?, ?)")
                    ->execute([$size_id, $p_id]);
            }
        }

        // Product Colors
        if (!empty($_POST['color'])) {
            foreach ($_POST['color'] as $color_id) {
                $pdo->prepare("INSERT INTO tbl_product_color (color_id, p_id) VALUES (?, ?)")
                    ->execute([$color_id, $p_id]);
            }
        }

        $success_message = 'Product added successfully.';
    }
}
?>


<!-- HTML Part - Retained (Unchanged) -->
<section class="content-header">
    <div class="content-header-left">
        <h1>Add Product</h1>
    </div>
    <div class="content-header-right">
        <a href="product.php" class="btn btn-primary btn-sm">View All</a>
    </div>
</section>

<section class="content">
    <div class="row">
        <div class="col-md-12">

            <?php if($error_message): ?>
            <div class="callout callout-danger">

                <p>
                    <?php echo $error_message; ?>
                </p>
            </div>
            <?php endif; ?>

            <?php if($success_message): ?>
            <div class="callout callout-success">

                <p><?php echo $success_message; ?></p>
            </div>
            <?php endif; ?>

            <form class="form-horizontal" action="" method="post" enctype="multipart/form-data">

                <div class="box box-info">
                    <div class="box-body">
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Top Level Category Name
                                <span>*</span></label>
                            <div class="col-sm-4">
                                <select name="tcat_id" class="form-control select2 top-cat">
                                    <option value="">Select Top Level Category</option>
                                    <?php
									$statement = $pdo->prepare("SELECT * FROM tbl_top_category ORDER BY tcat_name ASC");
									$statement->execute();
									$result = $statement->fetchAll(PDO::FETCH_ASSOC);	
									foreach ($result as $row) {
										?>
                                    <option value="<?php echo $row['tcat_id']; ?>">
                                        <?php echo $row['tcat_name']; ?></option>
                                    <?php
									}
									?>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Mid Level Category Name
                                <span>*</span></label>
                            <div class="col-sm-4">
                                <select name="mcat_id" class="form-control select2 mid-cat">
                                    <option value="">Select Mid Level Category</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">End Level Category Name
                                <span>*</span></label>
                            <div class="col-sm-4">
                                <select name="ecat_id" class="form-control select2 end-cat">
                                    <option value="">Select End Level Category</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Product Name <span>*</span></label>
                            <div class="col-sm-4">
                                <input type="text" name="p_name" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Old Price <br><span
                                    style="font-size:10px;font-weight:normal;">(In INR)</span></label>
                            <div class="col-sm-4">
                                <input type="text" name="p_old_price" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Current Price
                                <span>*</span><br><span style="font-size:10px;font-weight:normal;">(In
                                    INR)</span></label>
                            <div class="col-sm-4">
                                <input type="text" name="p_current_price" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Quantity <span>*</span></label>
                            <div class="col-sm-4">
                                <input type="text" name="p_qty" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Select Size</label>
                            <div class="col-sm-4">
                                <select name="size[]" class="form-control select2" multiple="multiple">
                                    <?php
    $stmt = $pdo->query("SELECT * FROM tbl_size ORDER BY size_name ASC");
    foreach ($stmt as $row) {
        echo "<option value='{$row['size_id']}'>{$row['size_name']}</option>";
    }
    ?>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Select Color</label>
                            <div class="col-sm-8">
                                <div class="row">
                                    <?php
            $stmt = $pdo->query("SELECT * FROM tbl_color ORDER BY color_code ASC");
            foreach ($stmt as $row):
                $color_id = $row['color_id'];
                $color_code = $row['color_code'];
                $shape = $row['shape']; 
                $border_radius = $shape === 'circle' ? '50%' : '0';
            ?>
                                    <div class="col-md-2 text-center mb-2">
                                        <label style="cursor:pointer;">
                                            <div
                                                style="width:30px; height:30px; background:<?php echo $color_code; ?>; border:1px solid #888; border-radius:<?php echo $border_radius; ?>; margin:auto;">
                                            </div>
                                            <input type="checkbox" name="color[]" value="<?php echo $color_id; ?>"
                                                style="margin-top:5px;">
                                            <div style="font-size:12px;"><?php echo strtoupper($shape); ?></div>
                                        </label>
                                    </div>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Featured Photo
                                <span>*</span></label>
                            <div class="col-sm-4" style="padding-top:4px;">
                                <input type="file" name="p_featured_photo">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Other Photos</label>
                            <div class="col-sm-4" style="padding-top:4px;">
                                <table id="ProductTable" style="width:100%;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div class="upload-btn">
                                                    <input type="file" name="photo[]" style="margin-bottom:5px;">
                                                </div>
                                            </td>
                                            <td style="width:28px;"><a href="javascript:void()"
                                                    class="Delete btn btn-danger btn-xs">X</a></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-sm-2">
                                <input type="button" id="btnAddNew" value="Add Item"
                                    style="margin-top: 5px;margin-bottom:10px;border:0;color: #fff;font-size: 14px;border-radius:3px;"
                                    class="btn btn-warning btn-xs">
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
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Is Featured?</label>
                            <div class="col-sm-8">
                                <select name="p_is_featured" class="form-control" style="width:auto;">
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label">Is Active?</label>
                            <div class="col-sm-8">
                                <select name="p_is_active" class="form-control" style="width:auto;">
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="" class="col-sm-3 control-label"></label>
                            <div class="col-sm-6">
                                <button type="submit" class="btn btn-success pull-left" name="form1">Add
                                    Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>

</section>

<?php require_once('footer.php'); ?>