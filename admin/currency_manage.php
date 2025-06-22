<?php require_once('header.php'); ?>
<?php
$currency_name = '';
$edit_id = null;

// Handle Add
if (isset($_POST['add'])) {
    $stmt = $conn->prepare("INSERT INTO tbl_currency (currency_name) VALUES (?)");
    $stmt->bind_param("s", $_POST['currency_name']);
    $stmt->execute();
    header("Location: currency_manage.php");
    exit;
}

// Handle Edit - load existing data
if (isset($_GET['edit_id'])) {
    $edit_id = $_GET['edit_id'];
    $result = $conn->query("SELECT * FROM tbl_currency WHERE id=$edit_id");
    if ($result && $row = $result->fetch_assoc()) {
        $currency_name = $row['currency_name'];
    }
}

// Handle Update
if (isset($_POST['update'])) {
    $id = $_POST['id'] ?? 0;
    $stmt = $conn->prepare("UPDATE tbl_currency SET currency_name=? WHERE id=?");
    $stmt->bind_param("si", $_POST['currency_name'], $id);
    $stmt->execute();
    header("Location: currency_manage.php");
    exit;
}
?>

<!-- Include Select2 & jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

<style>
label {
    font-weight: bold;
    margin-right: 10px;
}

select {
    padding: 6px 10px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    min-width: 350px;
}
</style>

<section class="content-header">
    <div class="content-header-left">
        <h1>Manage Currency</h1>
    </div>

</section>

<section class="content">
    <div class="row">
        <div class="col-md-12">
            <form method="post">
                <input type="hidden" name="id" value="<?php echo $edit_id; ?>">
                <label for="currency">Select Currency:</label>
                <select id="currency" name="currency_name" style="width: 100%">
                    <option value="USD" data-image="https://flagcdn.com/us.svg"
                        <?php if($currency_name == 'USD') echo 'selected'; ?>>USD: United States Dollar</option>
                    <option value="EUR" data-image="https://flagcdn.com/eu.svg"
                        <?php if($currency_name == 'EUR') echo 'selected'; ?>>EUR: Euro</option>
                    <option value="GBP" data-image="https://flagcdn.com/gb.svg"
                        <?php if($currency_name == 'GBP') echo 'selected'; ?>>GBP: British Pound Sterling</option>
                    <option value="AUD" data-image="https://flagcdn.com/au.svg"
                        <?php if($currency_name == 'AUD') echo 'selected'; ?>>AUD: Australian Dollar</option>
                    <option value="CAD" data-image="https://flagcdn.com/ca.svg"
                        <?php if($currency_name == 'CAD') echo 'selected'; ?>>CAD: Canadian Dollar</option>
                    <option value="JPY" data-image="https://flagcdn.com/jp.svg"
                        <?php if($currency_name == 'JPY') echo 'selected'; ?>>JPY: Japanese Yen</option>
                    <option value="CNY" data-image="https://flagcdn.com/cn.svg"
                        <?php if($currency_name == 'CNY') echo 'selected'; ?>>CNY: Chinese Yuan</option>
                    <option value="INR" data-image="https://flagcdn.com/in.svg"
                        <?php if($currency_name == 'INR') echo 'selected'; ?>>INR: Indian Rupee</option>
                </select>
                <br><br>
                <?php if ($edit_id): ?>
                <button type="submit" name="update" class="btn btn-warning">Update Currency</button>
                <?php else: ?>
                <button type="submit" name="add" class="btn btn-success">Add Currency</button>
                <?php endif; ?>
            </form>

            <hr>
            <h3>Available Currencies</h3>
            <div class="box box-info">
                <div class="box-body table-responsive">
                    <table id="example1" class="table table-bordered table-hover table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Currency Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
$result = $conn->query("SELECT * FROM tbl_currency");
$i = 1;
while ($row = $result->fetch_assoc()):
?>
                            <tr>
                                <td><?php echo $i++; ?></td>
                                <td>
                                    <?php
            $currency_code = $row['currency_name'];
            $flags = [
                'USD' => 'us',
                'EUR' => 'eu',
                'GBP' => 'gb',
                'AUD' => 'au',
                'CAD' => 'ca',
                'JPY' => 'jp',
                'CNY' => 'cn',
                'INR' => 'in'
            ];
            $flagCode = isset($flags[$currency_code]) ? $flags[$currency_code] : 'un';
            $flagUrl = "https://flagcdn.com/24x18/$flagCode.png";
        ?>
                                    <img src="<?php echo $flagUrl; ?>" width="24" height="18"
                                        alt="<?php echo $currency_code; ?> flag" style="margin-right: 5px;">
                                    <?php echo htmlspecialchars($currency_code); ?>
                                </td>
                                <td>
                                    <a href="currency_manage.php?edit_id=<?php echo $row['id']; ?>"
                                        class="btn btn-sm btn-primary">Edit</a>
                                </td>
                            </tr>
                            <?php endwhile; ?>
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    </div>

    <script>
    function formatCurrency(state) {
        if (!state.id) return state.text;
        var img = $(state.element).data('image');
        var $state = $(`
            <span><img src="${img}" style="width: 20px; height: 15px; margin-right: 8px;"> ${state.text}</span>
        `);
        return $state;
    }

    $(document).ready(function() {
        $('#currency').select2({
            templateResult: formatCurrency,
            templateSelection: formatCurrency,
            minimumResultsForSearch: -1
        });
    });
    </script>

    <?php require_once('footer.php'); ?>