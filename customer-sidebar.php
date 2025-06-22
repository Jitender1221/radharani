<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="dashboard.php">Radha Rani Textiles</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
        aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item active">
                <a class="nav-link" href="dashboard.php">
                    <?php echo LANG_VALUE_89; ?> <span class="sr-only">(current)</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="customer-profile-update.php">
                    <?php echo LANG_VALUE_117; ?>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="customer-billing-shipping-update.php">
                    <?php echo LANG_VALUE_88; ?>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="customer-password-update.php">
                    <?php echo LANG_VALUE_99; ?>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="customer-order.php">
                    <?php echo LANG_VALUE_24; ?>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="logout.php">
                    <?php echo LANG_VALUE_14; ?>
                </a>
            </li>
        </ul>
    </div>
</nav>

<style>
.navbar-toggler {
    border: none;
    background-color: none;


}

.navbar {
    background-color: #333;
    color: #fff;
    padding: 15px;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 95%;
    margin-bottom: 10px;
    margin-top: 10px;
    border-radius: 10px;
    left: 0;
    right: 0;
    margin: auto;
    margin-bottom: 20px;
    margin-top: 20px;
    list-style: none;
}

.navbar .nav-item {
    list-style: none;
}

.navbar .nav-item .nav-link {
    text-decoration: none;
    color: #fff;
    padding: 8px 12px;
    display: block;
}
</style>



<!-- Bootstrap 4 JS and dependencies -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>