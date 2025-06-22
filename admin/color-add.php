<?php require_once('header.php'); ?>

<?php
$error_message = '';
$success_message = '';

if(isset($_POST['form1'])) {
    $valid = 1;

    $color_code = $_POST['color_code'] ?? '';
    $shape = $_POST['shape'] ?? '';
    $preview_html = $_POST['preview_html'] ?? '';

    if(empty($color_code)) {
        $valid = 0;
        $error_message .= "Color Code cannot be empty<br>";
    }

    if(empty($shape)) {
        $valid = 0;
        $error_message .= "Shape must be selected<br>";
    }

    if($valid) {
        $statement = $pdo->prepare("SELECT * FROM tbl_color WHERE color_code = ?");
        $statement->execute([$color_code]);
        if($statement->rowCount()) {
            $valid = 0;
            $error_message .= "Color already exists<br>";
        }
    }

    if($valid == 1) {
        $statement = $pdo->prepare("INSERT INTO tbl_color (color_code, shape, preview_html) VALUES (?, ?, ?)");
        $statement->execute([$color_code, $shape, $preview_html]);
        $success_message = 'Color added successfully.';
        header('location: color-add.php');
    }
}
?>

<section class="content-header">
    <div class="content-header-left">
        <h1>Add Color</h1>
    </div>
    <div class="content-header-right">
        <a href="color.php" class="btn btn-primary btn-sm">View All</a>
    </div>
</section>

<section class="content">
    <div class="row">
        <div class="col-md-12">

            <?php if(!empty($error_message)): ?>
            <div class="callout callout-danger">
                <p><?php echo $error_message; ?></p>
            </div>
            <?php endif; ?>

            <?php if(!empty($success_message)): ?>
            <div class="callout callout-success">
                <p><?php echo $success_message; ?></p>
            </div>
            <?php endif; ?>

            <form class="form-horizontal" action="" method="post">
                <input type="hidden" name="color_code" id="colorCodeHidden">
                <input type="hidden" name="shape" id="shapeHidden">
                <input type="hidden" name="preview_html" id="previewHtmlHidden">

                <div class="box box-info">
                    <div class="box-body">
                        <div class="form-group">

                            <div class="col-md-3">
                                <label>Select a Color:</label>
                                <input type="color" class="form-control" id="colorPicker" value="#a05a2c"><br>
                            </div>

                            <div class="col-md-3">
                                <label>Shape:</label>
                                <select id="colorShape" class="form-control">
                                    <option value="circle">Circle</option>
                                    <option value="box">Box</option>
                                </select>
                            </div>

                            <div class="col-md-3">
                                <label>Generated Color Code:</label>
                                <input type="text" class="form-control" id="colorResult"><br>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="" class="col-sm-2 control-label"></label>
                            <div class="col-md-3">
                                <button type="submit" class="btn btn-success pull-left" name="form1">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <!-- Live Preview -->
            <div class="form-group col-md-3">
                <label>Preview:</label>
                <div id="colorPreview" style="width:30px; height:30px; border:1px solid #ccc;"></div>
            </div>
        </div>
    </div>
</section>

<script>
document.addEventListener("DOMContentLoaded", function() {
    const colorPicker = document.getElementById("colorPicker");
    const colorResult = document.getElementById("colorResult");
    const colorPreview = document.getElementById("colorPreview");
    const shapeSelect = document.getElementById("colorShape");

    const hiddenColor = document.getElementById("colorCodeHidden");
    const hiddenShape = document.getElementById("shapeHidden");
    const hiddenPreview = document.getElementById("previewHtmlHidden");

    function updateColorPreview() {
        const color = colorPicker.value;
        const shape = shapeSelect.value;

        colorResult.value = color;
        hiddenColor.value = color;
        hiddenShape.value = shape;

        colorPreview.style.backgroundColor = color;
        colorPreview.style.borderRadius = shape === 'circle' ? '50%' : '0';

        const previewHTML =
            `<div style="width:30px; height:30px; background:${color}; border-radius:${shape === 'circle' ? '50%' : '0'};"></div>`;
        hiddenPreview.value = previewHTML;
    }

    colorPicker.addEventListener("input", updateColorPreview);
    shapeSelect.addEventListener("change", updateColorPreview);

    updateColorPreview();
});
</script>

<?php require_once('footer.php'); ?>