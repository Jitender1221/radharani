<?php require_once('header.php'); ?>

<?php
if (!isset($_GET['color_id']) || !is_numeric($_GET['color_id'])) {
    header('location: color.php');
    exit;
}

$color_id = $_GET['color_id'];
$error_message = '';
$success_message = '';

// Fetch existing record
$statement = $pdo->prepare("SELECT * FROM tbl_color WHERE color_id=?");
$statement->execute([$color_id]);
$result = $statement->fetch(PDO::FETCH_ASSOC);

if (!$result) {
    header('location: color.php');
    exit;
}

$existing_color = $result['color_code'];
$existing_shape = $result['shape'];

if (isset($_POST['form1'])) {
    $color_code = $_POST['color_code'] ?? '';
    $shape = $_POST['shape'] ?? '';
    $preview_html = $_POST['preview_html'] ?? '';

    if (empty($color_code) || empty($shape)) {
        $error_message .= 'Color Code and Shape are required.<br>';
    } else {
        // Check for duplicates excluding current
        $statement = $pdo->prepare("SELECT * FROM tbl_color WHERE color_code=? AND color_id!=?");
        $statement->execute([$color_code, $color_id]);
        if ($statement->rowCount()) {
            $error_message .= 'Color code already exists.<br>';
        }
    }

    if (empty($error_message)) {
        $statement = $pdo->prepare("UPDATE tbl_color SET color_code=?, shape=?, preview_html=? WHERE color_id=?");
        $statement->execute([$color_code, $shape, $preview_html, $color_id]);
        $success_message = 'Color updated successfully.';
		  header('location: color-edit.php');
        // Refresh updated values
        $existing_color = $color_code;
        $existing_shape = $shape;
    }
}
?>

<section class="content-header">
    <div class="content-header-left">
        <h1>Edit Color</h1>
    </div>
    <div class="content-header-right">
        <a href="color.php" class="btn btn-primary btn-sm">View All</a>
    </div>
</section>

<section class="content">
    <div class="row">
        <div class="col-md-12">

            <?php if ($error_message): ?>
            <div class="callout callout-danger">
                <p><?php echo $error_message; ?></p>
            </div>
            <?php endif; ?>

            <?php if ($success_message): ?>
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
                                <label>Select Color:</label>
                                <input type="color" class="form-control" id="colorPicker"
                                    value="<?php echo htmlspecialchars($existing_color); ?>"><br>
                            </div>

                            <div class="col-md-3">
                                <label>Shape:</label>
                                <select id="colorShape" class="form-control">
                                    <option value="circle" <?php if ($existing_shape == 'circle') echo 'selected'; ?>>
                                        Circle</option>
                                    <option value="box" <?php if ($existing_shape == 'box') echo 'selected'; ?>>Box
                                    </option>
                                </select>
                            </div>

                            <div class="col-md-3">
                                <label>Color Code:</label>
                                <input type="text" class="form-control" id="colorResult"><br>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label"></label>
                            <div class="col-md-3">
                                <button type="submit" class="btn btn-success" name="form1">Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <div class="form-group col-md-3">
                <label>Preview:</label>
                <div id="colorPreview" style="width:40px; height:40px; border:1px solid #ccc;"></div>
            </div>

        </div>
    </div>
</section>

<script>
document.addEventListener("DOMContentLoaded", function() {
    const colorPicker = document.getElementById("colorPicker");
    const shapeSelect = document.getElementById("colorShape");
    const colorResult = document.getElementById("colorResult");
    const preview = document.getElementById("colorPreview");

    const hiddenColor = document.getElementById("colorCodeHidden");
    const hiddenShape = document.getElementById("shapeHidden");
    const hiddenPreview = document.getElementById("previewHtmlHidden");

    function updatePreview() {
        const color = colorPicker.value;
        const shape = shapeSelect.value;

        colorResult.value = color;
        hiddenColor.value = color;
        hiddenShape.value = shape;

        preview.style.backgroundColor = color;
        preview.style.borderRadius = shape === 'circle' ? '50%' : '0';

        hiddenPreview.value =
            `<div style="width:30px; height:30px; background:${color}; border-radius:${shape === 'circle' ? '50%' : '0'};"></div>`;
    }

    colorPicker.addEventListener("input", updatePreview);
    shapeSelect.addEventListener("change", updatePreview);

    updatePreview();
});
</script>

<?php require_once('footer.php'); ?>