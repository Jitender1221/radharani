<?php require_once('header.php'); ?>

<section class="content-header">
    <div class="content-header-left">
        <h1>View Products</h1>
    </div>
    <div class="content-header-right">
        <a href="product-add.php" class="btn btn-primary btn-sm">Add Product</a>
    </div>
</section>

<section class="content">
    <div class="row">
        <div class="col-md-12">
            <div class="box box-info">
                <div class="box-body table-responsive">
                    <table id="example1" class="table table-bordered table-hover table-striped">
                        <thead class="thead-dark">
                            <tr>
                                <th width="10">#</th>
                                <th>Photo</th>
                                <th width="160">Product Name</th>
                                <th width="60">Old Price</th>
                                <th width="60">(C) Price</th>
                                <th width="60">Quantity</th>
                                <th>Sizes</th>
                                <th>Colors</th>
                                <th>Featured?</th>
                                <th>Active?</th>
                                <th>Category</th>
                                <th width="80">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            require_once('./inc/config.php');

                            $i = 0;
                            $statement = $pdo->prepare("SELECT
                                t1.p_id,
                                t1.p_name,
                                t1.p_old_price,
                                t1.p_current_price,
                                t1.p_qty,
                                t1.p_featured_photo,
                                t1.p_is_featured,
                                t1.p_is_active,
                                t2.ecat_name,
                                t3.mcat_name,
                                t4.tcat_name
                                FROM tbl_product t1
                                LEFT JOIN tbl_end_category t2 ON t1.ecat_id = t2.ecat_id
                                LEFT JOIN tbl_mid_category t3 ON t2.mcat_id = t3.mcat_id
                                LEFT JOIN tbl_top_category t4 ON t3.tcat_id = t4.tcat_id
                                ORDER BY t1.p_id DESC
                            ");
                            $statement->execute();
                            $result = $statement->fetchAll(PDO::FETCH_ASSOC);

                            foreach ($result as $row) {
                                $i++;
                                $photo = '';
                                if (!empty($row['p_featured_photo'])) {
                                    $photo = $row['p_featured_photo'];
                                } else {
                                    $stmt_photo = $pdo->prepare("SELECT photo FROM tbl_product_photo WHERE p_id = ? ORDER BY p_id ASC LIMIT 1");
                                    $stmt_photo->execute([$row['p_id']]);
                                    $photo_row = $stmt_photo->fetch(PDO::FETCH_ASSOC);
                                    if ($photo_row && !empty($photo_row['photo'])) {
                                        $photo = $photo_row['photo'];
                                    }
                                }

                                // Fetch Sizes
                                $sizes = [];
                                $stmt_size = $pdo->prepare("SELECT size_id FROM tbl_product_size WHERE p_id = ?");
                                $stmt_size->execute([$row['p_id']]);
                                $sizes = $stmt_size->fetchAll(PDO::FETCH_COLUMN);

                                // Fetch Colors
                                $colors = [];
                                $stmt_color = $pdo->prepare("SELECT color_id FROM tbl_product_color WHERE p_id = ?");
                                $stmt_color->execute([$row['p_id']]);
                                $colors = $stmt_color->fetchAll(PDO::FETCH_COLUMN);
                            ?>
                            <tr>
                                <td><?php echo $i; ?></td>
                                <td style="width:82px;">
                                    <?php if (!empty($photo)) { ?>
                                    <img src="../assets/uploads/<?php echo $photo; ?>"
                                        alt="<?php echo $row['p_name']; ?>" style="width:80px;">
                                    <?php } else { ?>
                                    <span class="text-muted">No photo</span>
                                    <?php } ?>
                                </td>
                                <td><?php echo $row['p_name']; ?></td>
                                <td><span>&#8377;</span><?php echo $row['p_old_price']; ?></td>
                                <td><span>&#8377;</span><?php echo $row['p_current_price']; ?></td>
                                <td><?php echo $row['p_qty']; ?></td>
                                <td><?php echo implode(', ', $sizes); ?></td>
                                <td><?php echo implode(', ', $colors); ?></td>
                                <td>
                                    <?php if ($row['p_is_featured'] == 1) {
                                        echo '<span class="badge badge-success" style="background-color:green;">Yes</span>';
                                    } else {
                                        echo '<span class="badge badge-danger" style="background-color:red;">No</span>';
                                    } ?>
                                </td>
                                <td>
                                    <?php if ($row['p_is_active'] == 1) {
                                        echo '<span class="badge badge-success" style="background-color:green;">Yes</span>';
                                    } else {
                                        echo '<span class="badge badge-danger" style="background-color:red;">No</span>';
                                    } ?>
                                </td>
                                <td><?php echo $row['tcat_name'] . '<br>' . $row['mcat_name'] . '<br>' . $row['ecat_name']; ?>
                                </td>
                                <td>
                                    <a href="product-edit.php?id=<?php echo $row['p_id']; ?>"
                                        class="btn btn-primary btn-xs">Edit</a>
                                    <a href="#" class="btn btn-danger btn-xs"
                                        data-href="product-delete.php?id=<?php echo $row['p_id']; ?>"
                                        data-toggle="modal" data-target="#confirm-delete">Delete</a>
                                </td>
                            </tr>
                            <?php } ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</section>

<div class="modal fade" id="confirm-delete" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="myModalLabel">Delete Confirmation</h4>
            </div>
            <div class="modal-body">
                <p>Are you sure want to delete this item?</p>
                <p style="color:red;">Be careful! This product will be deleted from the order table, payment table, size
                    table, color table and rating table also.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <a class="btn btn-danger btn-ok">Delete</a>
            </div>
        </div>
    </div>
</div>

<?php require_once('footer.php'); ?>