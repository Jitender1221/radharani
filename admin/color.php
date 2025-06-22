<?php require_once('header.php'); ?>

<section class="content-header">
    <div class="content-header-left">
        <h1>View All Colors</h1>
    </div>
    <div class="content-header-right">
        <a href="color-add.php" class="btn btn-primary btn-sm">Add New</a>
    </div>
</section>

<section class="content">
    <div class="row">
        <div class="col-md-12">

            <div class="box box-info">
                <div class="box-body table-responsive">
                    <table id="example1" class="table table-bordered table-striped">
                        <thead>
                            <tr style="background-color:#f1f1f1;">
                                <th>SL</th>
                                <th>Color Code</th>
                                <th>Shape</th>
                                <th>Preview</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $i = 0;
                            $statement = $pdo->prepare("SELECT * FROM tbl_color ORDER BY color_id DESC");
                            $statement->execute();
                            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
                            foreach ($result as $row) {
                                $i++;
                                ?>
                            <tr>
                                <td><?php echo $i; ?></td>
                                <td><?php echo htmlspecialchars($row['color_code']); ?></td>
                                <td><?php echo ucfirst($row['shape']); ?></td>
                                <td><?php echo $row['preview_html']; ?></td>
                                <td>
                                    <a href="color-edit.php?color_id=<?php echo $row['color_id']; ?>"
                                        class="btn btn-sm btn-warning">Edit</a>
                                    <a href="color-delete.php?color_id=<?php echo $row['color_id']; ?>"
                                        class="btn btn-sm btn-danger"
                                        onclick="return confirm('Are you sure?');">Delete</a>
                                </td>
                            </tr>
                            <?php
                            }
                            ?>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
</section>

<?php require_once('footer.php'); ?>