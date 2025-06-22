<?php require_once('header.php'); ?>
<?php
require_once('./inc/config.php');

$result = $conn->query("SELECT * FROM tbl_banner ORDER BY id DESC LIMIT 1");
$row = $result->num_rows > 0 ? $result->fetch_assoc() : null;
?>

<section class="content-header">
    <div class="content-header-left">
        <h1>Sale Banner</h1>
    </div>
    <div class="content-header-right">

    </div>
</section>


<link rel="stylesheet" href="banner.css">

<style>
@font-face {
    font-family: 'ErotiqueTrial-Regular';
    src: url('./fonts/ErotiqueTrial-Regular.ttf') format('ttf'),
        url('./fonts/ErotiqueTrial-Medium.ttf') format('ttf');
    font-weight: normal;
}
</style>

<section class="content">
    <div class="row">
        <div class="col-md-12">
            <div class="box box-info">

                <form action="sale_banner_edit.php" method="POST" enctype="multipart/form-data">
                    <label>Left Text:</label>
                    <input type="text" name="left_text" id="leftText" value="<?= $row['left_text'] ?? '20% OFF*' ?>"
                        required><br>

                    <label>Center Text:</label>
                    <input type="text" name="center_text" id="centerText" value="<?= $row['center_text'] ?? 'SALE' ?>"
                        required><br>

                    <label>Right Text:</label>
                    <input type="text" name="right_text" id="rightText" value="<?= $row['right_text'] ?? '20% OFF*' ?>"
                        required><br>

                    <label>Subtext:</label>
                    <input type="text" name="subtext" id="subText" value="<?= $row['subtext'] ?? 'First Order' ?>"><br>

                    <label>Background Type:</label>
                    <select name="bg_type" id="bg_type" onchange="toggleBgInputs()">
                        <option value="color"
                            <?= isset($row['bg_type']) && $row['bg_type'] == 'color' ? 'selected' : '' ?>>Color Gradient
                        </option>
                        <option value="image"
                            <?= isset($row['bg_type']) && $row['bg_type'] == 'image' ? 'selected' : '' ?>>Image</option>
                    </select><br><br>

                    <!-- GRADIENT PICKER -->
                    <div id="color_inputs"
                        style="display: <?= (isset($row['bg_type']) && $row['bg_type'] == 'color') ? 'block' : 'none' ?>;">
                        <label>From Color:</label>
                        <input type="color" id="colorFrom" value="#a05a2c"><br>

                        <label>To Color:</label>
                        <input type="color" id="colorTo" value="#5b3219"><br>

                        <label>Direction:</label>
                        <select id="gradientDirection">
                            <option value="to right">Left → Right</option>
                            <option value="to left">Right ← Left</option>
                            <option value="to bottom">Top → Bottom</option>
                            <option value="to top">Bottom → Top</option>
                            <option value="45deg">45°</option>
                            <option value="135deg">135°</option>
                        </select><br>

                        <label>Generated Gradient CSS:</label>
                        <input type="text" name="bg_value_color" id="gradientResult"
                            value="<?= (isset($row['bg_type']) && $row['bg_type'] == 'color') ? $row['bg_value'] : '' ?>"
                            readonly><br>
                    </div>

                    <!-- IMAGE INPUT -->
                    <div id="image_input"
                        style="display: <?= (isset($row['bg_type']) && $row['bg_type'] == 'image') ? 'block' : 'none' ?>;">
                        <label>If Image: Upload Banner Image</label>
                        <input type="file" name="bg_image" id="bgImageInput" accept="image/*"
                            onchange="previewImage(event)"><br>
                    </div><br>

                    <button type="submit">Save Banner</button>
                </form>

                <!-- ✅ LIVE BANNER PREVIEW -->
                <div id="bannerPreview" class="banner-preview">
                    <div style="display:flex; justify-content:space-around; align-items:center; flex-wrap:wrap;">
                        <div id="previewLeft" style="flex:1; font-size:24px;"><?= $row['left_text'] ?? '20% OFF*' ?>
                        </div>
                        <div id="previewCenter" style="flex:1; font-size:48px;   font-family: 'ErotiqueTrial-Regular';">
                            <?= $row['center_text'] ?? 'SALE' ?>
                        </div>
                        <div id="previewRight" style="flex:1; font-size:24px;"><?= $row['right_text'] ?? '20% OFF*' ?>
                        </div>
                    </div>
                    <div id="previewSub" style="font-size:18px; margin-top:10px;">
                        <?= $row['subtext'] ?? 'First Order' ?></div>
                </div>


            </div>
        </div>
    </div>
</section>

<script>
function updateGradient() {
    const from = document.getElementById('colorFrom').value;
    const to = document.getElementById('colorTo').value;
    const dir = document.getElementById('gradientDirection').value;

    const gradient = `linear-gradient(${dir}, ${from}, ${to})`;
    document.getElementById('gradientResult').value = gradient;
    document.getElementById('bannerPreview').style.background = gradient;
}

function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        document.getElementById('bannerPreview').style.background = `url(${reader.result})`;
        document.getElementById('bannerPreview').style.backgroundSize = 'cover';
        document.getElementById('bannerPreview').style.backgroundPosition = 'center';
    };
    reader.readAsDataURL(event.target.files[0]);
}

function toggleBgInputs() {
    const type = document.getElementById('bg_type').value;
    document.getElementById('color_inputs').style.display = type === 'color' ? 'block' : 'none';
    document.getElementById('image_input').style.display = type === 'image' ? 'block' : 'none';

    if (type === 'color') {
        updateGradient();
    }
}

function updateTextPreview() {
    document.getElementById('previewLeft').innerText = document.getElementById('leftText').value;
    document.getElementById('previewCenter').innerText = document.getElementById('centerText').value;
    document.getElementById('previewRight').innerText = document.getElementById('rightText').value;
    document.getElementById('previewSub').innerText = document.getElementById('subText').value;
}

// Events
document.getElementById('colorFrom').addEventListener('input', updateGradient);
document.getElementById('colorTo').addEventListener('input', updateGradient);
document.getElementById('gradientDirection').addEventListener('change', updateGradient);
document.getElementById('leftText').addEventListener('input', updateTextPreview);
document.getElementById('centerText').addEventListener('input', updateTextPreview);
document.getElementById('rightText').addEventListener('input', updateTextPreview);
document.getElementById('subText').addEventListener('input', updateTextPreview);

// Initialize on load
toggleBgInputs();
updateGradient();
updateTextPreview();
</script>


<?php require_once('footer.php');?>