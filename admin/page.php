<?php require_once('header.php'); ?>

<?php

if(isset($_POST['form_about'])) {
    
    $valid = 1;

    if(empty($_POST['about_title'])) {
        $valid = 0;
        $error_message .= 'Title can not be empty<br>';
    }

    if(empty($_POST['about_content'])) {
        $valid = 0;
        $error_message .= 'Content can not be empty<br>';
    }

    $path = $_FILES['about_banner']['name'];
    $path_tmp = $_FILES['about_banner']['tmp_name'];

    if($path != '') {
        $ext = pathinfo( $path, PATHINFO_EXTENSION );
        $file_name = basename( $path, '.' . $ext );
        if( $ext!='jpg' && $ext!='png' && $ext!='jpeg' && $ext!='gif' ) {
            $valid = 0;
            $error_message .= 'You must have to upload jpg, jpeg, gif or png file<br>';
        }
    }

    if($valid == 1) {

        if($path != '') {
            // removing the existing photo
            $statement = $pdo->prepare("SELECT * FROM tbl_page WHERE id=1");
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);                           
            foreach ($result as $row) {
                $about_banner = $row['about_banner'];
                unlink('../assets/uploads/'.$about_banner);
            }

            // updating the data
            $final_name = 'about-banner'.'.'.$ext;
            move_uploaded_file( $path_tmp, '../assets/uploads/'.$final_name );

            // updating the database
            $statement = $pdo->prepare("UPDATE tbl_page SET about_title=?,about_content=?,about_banner=?,about_meta_title=?,about_meta_keyword=?,about_meta_description=? WHERE id=1");
            $statement->execute(array($_POST['about_title'],$_POST['about_content'],$final_name,$_POST['about_meta_title'],$_POST['about_meta_keyword'],$_POST['about_meta_description']));
        } else {
            // updating the database
            $statement = $pdo->prepare("UPDATE tbl_page SET about_title=?,about_content=?,about_meta_title=?,about_meta_keyword=?,about_meta_description=? WHERE id=1");
            $statement->execute(array($_POST['about_title'],$_POST['about_content'],$_POST['about_meta_title'],$_POST['about_meta_keyword'],$_POST['about_meta_description']));
        }

        $success_message = 'About Page Information is updated successfully.';
        
    }
    
}


// Privacy Policy data fetching and updating

if (isset($_POST['form_privacy'])) {
    $valid = 1;
    $error_message = '';
    $success_message = '';

    // Validate title
    if (empty($_POST['privacy_title'])) {
        $valid = 0;
        $error_message .= 'Title cannot be empty.<br>';
    }

    // Validate content
    if (empty($_POST['privacy_content'])) {
        $valid = 0;
        $error_message .= 'Content cannot be empty.<br>';
    }

    // File upload validation
    $path2 = $_FILES['privacy_banner']['name'] ?? '';
    $path_tmp2 = $_FILES['privacy_banner']['tmp_name'] ?? '';

    if ($path2 != '') {
        $ext = strtolower(pathinfo($path2, PATHINFO_EXTENSION));
        $allowed_exts = ['jpg', 'jpeg', 'png', 'gif'];

        if (!in_array($ext, $allowed_exts)) {
            $valid = 0;
            $error_message .= 'Only jpg, jpeg, png, or gif files are allowed.<br>';
        }
    }

    if ($valid == 1) {
        if ($path2 != '') {
            // Remove existing banner
            $statement1 = $pdo->prepare("SELECT privacy_banner FROM tbl_page WHERE id=1");
            $statement1->execute();
            $result = $statement1->fetch(PDO::FETCH_ASSOC);

            if ($result && file_exists('../assets/uploads/' . $result['privacy_banner'])) {
                unlink('../assets/uploads/' . $result['privacy_banner']);
            }

            // Upload new file
            $final_privacy_name = 'privacy-banner.' . $ext;
            move_uploaded_file($path_tmp2, '../assets/uploads/' . $final_privacy_name);

            // Update database with banner
            $statement = $pdo->prepare("UPDATE tbl_page SET privacy_title=?, privacy_content=?, privacy_banner=?, privacy_meta_title=?, privacy_meta_keyword=?, privacy_meta_description=? WHERE id=1");
            $statement->execute([
                $_POST['privacy_title'],
                $_POST['privacy_content'],
                $final_privacy_name,
                $_POST['privacy_meta_title'],
                $_POST['privacy_meta_keyword'],
                $_POST['privacy_meta_description']
            ]);
        } else {
            // Update without banner
            $statement = $pdo->prepare("UPDATE tbl_page SET privacy_title=?, privacy_content=?, privacy_meta_title=?, privacy_meta_keyword=?, privacy_meta_description=? WHERE id=1");
            $statement->execute([
                $_POST['privacy_title'],
                $_POST['privacy_content'],
                $_POST['privacy_meta_title'],
                $_POST['privacy_meta_keyword'],
                $_POST['privacy_meta_description']
            ]);
        }

        $success_message = 'Privacy Page Information has been updated successfully.';
        header('location: page.php');
    }
}





if(isset($_POST['form_faq'])) {

$valid = 1;

if(empty($_POST['faq_title'])) {
$valid = 0;
$error_message .= 'Title can not be empty<br>';
}

$path = $_FILES['faq_banner']['name'];
$path_tmp = $_FILES['faq_banner']['tmp_name'];

if($path != '') {
$ext = pathinfo( $path, PATHINFO_EXTENSION );
$file_name = basename( $path, '.' . $ext );
if( $ext!='jpg' && $ext!='png' && $ext!='jpeg' && $ext!='gif' ) {
$valid = 0;
$error_message .= 'You must have to upload jpg, jpeg, gif or png file<br>';
}
}

if($valid == 1) {

if($path != '') {
// removing the existing photo
$statement = $pdo->prepare("SELECT * FROM tbl_page WHERE id=1");
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
foreach ($result as $row) {
$faq_banner = $row['faq_banner'];
unlink('../assets/uploads/'.$faq_banner);
}

// updating the data
$final_name = 'faq-banner'.'.'.$ext;
move_uploaded_file( $path_tmp, '../assets/uploads/'.$final_name );

// updating the database
$statement = $pdo->prepare("UPDATE tbl_page SET
faq_title=?,faq_banner=?,faq_meta_title=?,faq_meta_keyword=?,faq_meta_description=? WHERE id=1");
$statement->execute(array($_POST['faq_title'],$final_name,$_POST['faq_meta_title'],$_POST['faq_meta_keyword'],$_POST['faq_meta_description']));
} else {
// updating the database
$statement = $pdo->prepare("UPDATE tbl_page SET faq_title=?,faq_meta_title=?,faq_meta_keyword=?,faq_meta_description=?
WHERE id=1");
$statement->execute(array($_POST['faq_title'],$_POST['faq_meta_title'],$_POST['faq_meta_keyword'],$_POST['faq_meta_description']));
}

$success_message = 'FAQ Page Information is updated successfully.';

}

}



if(isset($_POST['form_contact'])) {

$valid = 1;

if(empty($_POST['contact_title'])) {
$valid = 0;
$error_message .= 'Title can not be empty<br>';
}

$path = $_FILES['contact_banner']['name'];
$path_tmp = $_FILES['contact_banner']['tmp_name'];

if($path != '') {
$ext = pathinfo( $path, PATHINFO_EXTENSION );
$file_name = basename( $path, '.' . $ext );
if( $ext!='jpg' && $ext!='png' && $ext!='jpeg' && $ext!='gif' ) {
$valid = 0;
$error_message .= 'You must have to upload jpg, jpeg, gif or png file<br>';
}
}

if($valid == 1) {

if($path != '') {
// removing the existing photo
$statement = $pdo->prepare("SELECT * FROM tbl_page WHERE id=1");
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
foreach ($result as $row) {
$contact_banner = $row['contact_banner'];
unlink('../assets/uploads/'.$contact_banner);
}

// updating the data
$final_name = 'contact-banner'.'.'.$ext;
move_uploaded_file( $path_tmp, '../assets/uploads/'.$final_name );

// updating the database
$statement = $pdo->prepare("UPDATE tbl_page SET
contact_title=?,contact_banner=?,contact_meta_title=?,contact_meta_keyword=?,contact_meta_description=? WHERE id=1");
$statement->execute(array($_POST['contact_title'],$final_name,$_POST['contact_meta_title'],$_POST['contact_meta_keyword'],$_POST['contact_meta_description']));
} else {
// updating the database
$statement = $pdo->prepare("UPDATE tbl_page SET
contact_title=?,contact_meta_title=?,contact_meta_keyword=?,contact_meta_description=? WHERE id=1");
$statement->execute(array($_POST['contact_title'],$_POST['contact_meta_title'],$_POST['contact_meta_keyword'],$_POST['contact_meta_description']));
}

$success_message = 'Contact Page Information is updated successfully.';

}

}




// ADD NEW CURRENCY
if (isset($_POST['add'])) {
$currency_code = $_POST['currency_code'];
$currency_name = $_POST['currency_name'];
$currency_flag = $_POST['currency_flag'];

$stmt = $conn->prepare("INSERT INTO tbl_page (currency_code, currency_name, currency_flag) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $currency_code, $currency_name, $currency_flag);
$stmt->execute();
$success_message = 'Currency is added successfully.';
header('location: page.php');
}



if (isset($_POST['form_return'])) {
    $valid = 1;
    $error_message = '';
    $success_message = '';

    // Required field validation
    if (empty($_POST['return_title'])) {
        $valid = 0;
        $error_message .= 'Title cannot be empty.<br>';
    }
    if (empty($_POST['return_content'])) {
        $valid = 0;
        $error_message .= 'Content cannot be empty.<br>';
    }

    // File upload check
    $path = $_FILES['return_banner']['name'] ?? '';
    $path_tmp = $_FILES['return_banner']['tmp_name'] ?? '';
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    $allowed_exts = ['jpg', 'jpeg', 'png', 'gif'];

    if ($path != '' && !in_array($ext, $allowed_exts)) {
        $valid = 0;
        $error_message .= 'Only jpg, jpeg, png, or gif files are allowed.<br>';
    }

    if ($valid == 1) {
        if ($path != '') {
            // Remove old banner
            $stmt = $pdo->prepare("SELECT return_banner FROM tbl_page WHERE id=1");
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row && file_exists('../assets/uploads/' . $row['return_banner'])) {
                unlink('../assets/uploads/' . $row['return_banner']);
            }

            // Upload new file
            $final_name = 'return-banner.' . $ext;
            move_uploaded_file($path_tmp, '../assets/uploads/' . $final_name);

            // Update DB with banner
            $stmt = $pdo->prepare("UPDATE tbl_page SET return_title=?, return_content=?, return_banner=?, return_meta_title=?, return_meta_keyword=?, return_meta_description=? WHERE id=1");
            $stmt->execute([
                $_POST['return_title'],
                $_POST['return_content'],
                $final_name,
                $_POST['return_meta_title'],
                $_POST['return_meta_keyword'],
                $_POST['return_meta_description']
            ]);
        } else {
            // Update DB without changing banner
            $stmt = $pdo->prepare("UPDATE tbl_page SET return_title=?, return_content=?, return_meta_title=?, return_meta_keyword=?, return_meta_description=? WHERE id=1");
            $stmt->execute([
                $_POST['return_title'],
                $_POST['return_content'],
                $_POST['return_meta_title'],
                $_POST['return_meta_keyword'],
                $_POST['return_meta_description']
            ]);
        }

        $success_message = 'Return Policy Page updated successfully.';
        header('location: page.php');
    }
}


if (isset($_POST['form_shipping'])) {
$valid = 1;
$error_message = '';
$success_message = '';

// Required field validation
if (empty($_POST['shipping_title'])) {
$valid = 0;
$error_message .= 'Title cannot be empty.<br>';
}
if (empty($_POST['shipping_content'])) {
$valid = 0;
$error_message .= 'Content cannot be empty.<br>';
}

// File upload check
$path = $_FILES['shipping_banner']['name'] ?? '';
$path_tmp = $_FILES['shipping_banner']['tmp_name'] ?? '';
$ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
$allowed_exts = ['jpg', 'jpeg', 'png', 'gif'];

if ($path != '' && !in_array($ext, $allowed_exts)) {
$valid = 0;
$error_message .= 'Only jpg, jpeg, png, or gif files are allowed.<br>';
}

if ($valid == 1) {
if ($path != '') {
// Remove old banner
$stmt = $pdo->prepare("SELECT shipping_banner FROM tbl_page WHERE id=1");
$stmt->execute();
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if ($row && file_exists('../assets/uploads/' . $row['shipping_banner'])) {
unlink('../assets/uploads/' . $row['shipping_banner']);
}

// Upload new file
$final_name = 'shipping-banner.' . $ext;
move_uploaded_file($path_tmp, '../assets/uploads/' . $final_name);

// Update DB with banner
$stmt = $pdo->prepare("UPDATE tbl_page SET shipping_title=?, shipping_content=?, shipping_banner=?,
shipping_meta_title=?, shipping_meta_keyword=?, shipping_meta_description=? WHERE id=1");
$stmt->execute([
$_POST['shipping_title'],
$_POST['shipping_content'],
$final_name,
$_POST['shipping_meta_title'],
$_POST['shipping_meta_keyword'],
$_POST['shipping_meta_description']
]);
} else {
// Update DB without changing banner
$stmt = $pdo->prepare("UPDATE tbl_page SET shipping_title=?, shipping_content=?, shipping_meta_title=?,
shipping_meta_keyword=?, shipping_meta_description=? WHERE id=1");
$stmt->execute([
$_POST['shipping_title'],
$_POST['shipping_content'],
$_POST['shipping_meta_title'],
$_POST['shipping_meta_keyword'],
$_POST['shipping_meta_description']
]);
}

$success_message = 'shipping Policy Page updated successfully.';
header('location: page.php');
}
}

if (isset($_POST['form_terms'])) {
    $valid = 1;
    $error_message = '';
    $success_message = '';

    // Required field validation
    if (empty($_POST['terms_title'])) {
        $valid = 0;
        $error_message .= 'Title cannot be empty.<br>';
    }
    if (empty($_POST['terms_content'])) {
        $valid = 0;
        $error_message .= 'Content cannot be empty.<br>';
    }

    // File upload check
    $path = $_FILES['terms_banner']['name'] ?? '';
    $path_tmp = $_FILES['terms_banner']['tmp_name'] ?? '';
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    $allowed_exts = ['jpg', 'jpeg', 'png', 'gif'];

    if ($path != '' && !in_array($ext, $allowed_exts)) {
        $valid = 0;
        $error_message .= 'Only jpg, jpeg, png, or gif files are allowed.<br>';
    }

    if ($valid == 1) {
        if ($path != '') {
            // Remove old banner
            $stmt = $pdo->prepare("SELECT terms_banner FROM tbl_page WHERE id=1");
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row && file_exists('../assets/uploads/' . $row['terms_banner'])) {
                unlink('../assets/uploads/' . $row['terms_banner']);
            }

            // Upload new file
            $final_name = 'terms-banner.' . $ext;
            move_uploaded_file($path_tmp, '../assets/uploads/' . $final_name);

            // Update DB with banner
            $stmt = $pdo->prepare("UPDATE tbl_page SET terms_title=?, terms_content=?, terms_banner=?, terms_meta_title=?, terms_meta_keyword=?, terms_meta_description=? WHERE id=1");
            $stmt->execute([
                $_POST['terms_title'],
                $_POST['terms_content'],
                $final_name,
                $_POST['terms_meta_title'],
                $_POST['terms_meta_keyword'],
                $_POST['terms_meta_description']
            ]);
        } else {
            // Update DB without changing banner
            $stmt = $pdo->prepare("UPDATE tbl_page SET terms_title=?, terms_content=?, terms_meta_title=?, terms_meta_keyword=?, terms_meta_description=? WHERE id=1");
            $stmt->execute([
                $_POST['terms_title'],
                $_POST['terms_content'],
                $_POST['terms_meta_title'],
                $_POST['terms_meta_keyword'],
                $_POST['terms_meta_description']
            ]);
        }

        $success_message = 'terms Policy Page updated successfully.';
        header('location: page.php');
    }
}


?>

<section class="content-header">
    <div class="content-header-left">
        <h1>Page Settings</h1>
    </div>
</section>

<?php
$statement = $pdo->prepare("SELECT * FROM tbl_page WHERE id=1");
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);                           
foreach ($result as $row) {
    $about_title = $row['about_title'];
    $about_content = $row['about_content'];
    $about_banner = $row['about_banner'];
    $about_meta_title = $row['about_meta_title'];
    $about_meta_keyword = $row['about_meta_keyword'];
    $about_meta_description = $row['about_meta_description'];
    $privacy_title = $row['privacy_title'];
    $privacy_content = $row['privacy_content'];
    $privacy_banner = $row['privacy_banner'];
    $privacy_meta_title = $row['privacy_meta_title'];
    $privacy_meta_keyword = $row['privacy_meta_keyword'];
    $privacy_meta_description = $row['privacy_meta_description']; 
    $return_title = $row['return_title'];
    $return_content = $row['return_content'];
    $return_banner = $row['return_banner'];
    $return_meta_title = $row['return_meta_title'];
    $return_meta_keyword = $row['return_meta_keyword'];
    $return_meta_description = $row['return_meta_description'];
      $shipping_title = $row['shipping_title'];
    $shipping_content = $row['shipping_content'];
    $shipping_banner = $row['shipping_banner'];
    $shipping_meta_title = $row['shipping_meta_title'];
    $shipping_meta_keyword = $row['shipping_meta_keyword'];
    $shipping_meta_description = $row['shipping_meta_description'];
      $terms_title = $row['terms_title'];
    $terms_content = $row['terms_content'];
    $terms_banner = $row['terms_banner'];
    $terms_meta_title = $row['terms_meta_title'];
    $terms_meta_keyword = $row['terms_meta_keyword'];
    $terms_meta_description = $row['terms_meta_description'];
    $currency_code = $row['currency_code'];
    $currency_name = $row['currency_name'];
    $currency_flag = $row['currency_flag'];
    $faq_title = $row['faq_title'];
    $faq_banner = $row['faq_banner'];
    $faq_meta_title = $row['faq_meta_title'];
    $faq_meta_keyword = $row['faq_meta_keyword'];
    $faq_meta_description = $row['faq_meta_description'];
    $contact_title = $row['contact_title'];
    $contact_banner = $row['contact_banner'];
    $contact_meta_title = $row['contact_meta_title'];
    $contact_meta_keyword = $row['contact_meta_keyword'];
    $contact_meta_description = $row['contact_meta_description'];

}
?>


<section class="content" style="min-height:auto;margin-bottom: -30px;">
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
        </div>
    </div>
</section>

<section class="content">

    <div class="row">
        <div class="col-md-12">

            <div class="nav-tabs-custom">
                <ul class="nav nav-tabs">
                    <li class="active"><a href="#tab_1" data-toggle="tab">About Us</a></li>
                    <li><a href="#tab_2" data-toggle="tab">Privacy Policy</a></li>
                    <li><a href="#tab_3" data-toggle="tab">FAQ</a></li>
                    <li><a href="#tab_4" data-toggle="tab">Contact</a></li>
                    <li><a href="#tab_5" data-toggle="tab">Return policy</a></li>
                    <li><a href="#tab_6" data-toggle="tab">Shipping policy</a></li>
                    <li><a href="#tab_7" data-toggle="tab">Terms policy</a></li>

                </ul>

                <!-- About us Page Content -->

                <div class="tab-content">
                    <div class="tab-pane active" id="tab_1">
                        <form class="form-horizontal" action="" method="post" enctype="multipart/form-data">
                            <div class="box box-info">
                                <div class="box-body">
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Page Title * </label>
                                        <div class="col-sm-5">
                                            <input class="form-control" type="text" name="about_title"
                                                value="<?php echo $about_title; ?>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Page Content * </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="about_content"
                                                id="editor1"><?php echo $about_content; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Existing Banner Photo</label>
                                        <div class="col-sm-6" style="padding-top:6px;">
                                            <img src="../assets/uploads/<?php echo $about_banner; ?>"
                                                class="existing-photo" style="height:80px;">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">New Banner Photo</label>
                                        <div class="col-sm-6" style="padding-top:6px;">
                                            <input type="file" name="about_banner">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Title</label>
                                        <div class="col-sm-8">
                                            <input class="form-control" type="text" name="about_meta_title"
                                                value="<?php echo $about_meta_title; ?>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Keyword </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="about_meta_keyword"
                                                style="height:100px;"><?php echo $about_meta_keyword; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Description </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="about_meta_description"
                                                style="height:100px;"><?php echo $about_meta_description; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label"></label>
                                        <div class="col-sm-6">
                                            <button type="submit" class="btn btn-success pull-left"
                                                name="form_about">Update</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <!-- Privacy Policy -->
                    <div class="tab-pane " id="tab_2">
                        <form class="form-horizontal" action="" method="post" enctype="multipart/form-data">
                            <div class="box box-info">
                                <div class="box-body">
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Page Title * </label>
                                        <div class="col-sm-5">
                                            <input class="form-control" type="text" name="privacy_title"
                                                value="<?php echo $privacy_title; ?>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Page Content * </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="privacy_content"
                                                id="editor2"><?php echo $privacy_content; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Existing Banner Photo</label>
                                        <div class="col-sm-6" style="padding-top:6px;">
                                            <img src="../assets/uploads/<?php echo $privacy_banner; ?>"
                                                class="existing-photo" style="height:80px;">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">New Banner Photo</label>
                                        <div class="col-sm-6" style="padding-top:6px;">
                                            <input type="file" name="about_banner">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Title</label>
                                        <div class="col-sm-8">
                                            <input class="form-control" type="text" name="privacy_meta_title"
                                                value="<?php echo $privacy_meta_title; ?>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Keyword </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="privacy_meta_keyword"
                                                style="height:100px;"><?php echo $privacy_meta_keyword; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Description </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="privacy_meta_description"
                                                style="height:100px;"><?php echo $privacy_meta_description; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label"></label>
                                        <div class="col-sm-6">
                                            <button type="submit" class="btn btn-success pull-left"
                                                name="form_privacy">Update</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <!-- FAQ Page Content -->

                    <div class="tab-pane" id="tab_3">
                        <form class="form-horizontal" action="" method="post" enctype="multipart/form-data">
                            <div class="box box-info">
                                <div class="box-body">
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Page Title * </label>
                                        <div class="col-sm-5">
                                            <input class="form-control" type="text" name="faq_title"
                                                value="<?php echo $faq_title; ?>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Existing Banner Photo</label>
                                        <div class="col-sm-6" style="padding-top:6px;">
                                            <img src="../assets/uploads/<?php echo $faq_banner; ?>"
                                                class="existing-photo" style="height:80px;">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">New Banner Photo</label>
                                        <div class="col-sm-6" style="padding-top:6px;">
                                            <input type="file" name="faq_banner">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Title</label>
                                        <div class="col-sm-8">
                                            <input class="form-control" type="text" name="faq_meta_title"
                                                value="<?php echo $faq_meta_title; ?>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Keyword </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="faq_meta_keyword"
                                                style="height:100px;"><?php echo $faq_meta_keyword; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Description </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="faq_meta_description"
                                                style="height:100px;"><?php echo $faq_meta_description; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label"></label>
                                        <div class="col-sm-6">
                                            <button type="submit" class="btn btn-success pull-left"
                                                name="form_faq">Update</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <!-- End of FAQ Page Content -->

                    <div class="tab-pane" id="tab_4">
                        <form class="form-horizontal" action="" method="post" enctype="multipart/form-data">
                            <div class="box box-info">
                                <div class="box-body">
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Page Title * </label>
                                        <div class="col-sm-5">
                                            <input class="form-control" type="text" name="contact_title"
                                                value="<?php echo $contact_title; ?>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Existing Banner Photo</label>
                                        <div class="col-sm-6" style="padding-top:6px;">
                                            <img src="../assets/uploads/<?php echo $contact_banner; ?>"
                                                class="existing-photo" style="height:80px;">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">New Banner Photo</label>
                                        <div class="col-sm-6" style="padding-top:6px;">
                                            <input type="file" name="contact_banner">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Title</label>
                                        <div class="col-sm-8">
                                            <input class="form-control" type="text" name="contact_meta_title"
                                                value="<?php echo $contact_meta_title; ?>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Keyword </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="contact_meta_keyword"
                                                style="height:100px;"><?php echo $contact_meta_keyword; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Description </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="contact_meta_description"
                                                style="height:100px;"><?php echo $contact_meta_description; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label"></label>
                                        <div class="col-sm-6">
                                            <button type="submit" class="btn btn-success pull-left"
                                                name="form_contact">Update</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <!-- Privacy Policy -->
                    <div class="tab-pane " id="tab_5">
                        <form class="form-horizontal" action="" method="post" enctype="multipart/form-data">
                            <div class="box box-info">
                                <div class="box-body">
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Page Title * </label>
                                        <div class="col-sm-5">
                                            <input class="form-control" type="text" name="return_title"
                                                value="<?php echo $return_title; ?>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Page Content * </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="return_content"
                                                id="editor3"><?php echo $return_content; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Existing Banner Photo</label>
                                        <div class="col-sm-6" style="padding-top:6px;">
                                            <img src="../assets/uploads/<?php echo $return_banner; ?>"
                                                class="existing-photo" style="height:80px;">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">New Banner Photo</label>
                                        <div class="col-sm-6" style="padding-top:6px;">
                                            <input type="file" name="return_banner">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Title</label>
                                        <div class="col-sm-8">
                                            <input class="form-control" type="text" name="return_meta_title"
                                                value="<?php echo $return_meta_title; ?>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Keyword </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="return_meta_keyword"
                                                style="height:100px;"><?php echo $return_meta_keyword; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Description </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="return_meta_description"
                                                style="height:100px;"><?php echo $return_meta_description; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label"></label>
                                        <div class="col-sm-6">
                                            <button type="submit" class="btn btn-success pull-left"
                                                name="form_return">Update</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>


                    <!-- Shipping Policy -->
                    <div class="tab-pane " id="tab_6">
                        <form class="form-horizontal" action="" method="post" enctype="multipart/form-data">
                            <div class="box box-info">
                                <div class="box-body">
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Page Title * </label>
                                        <div class="col-sm-5">
                                            <input class="form-control" type="text" name="shipping_title"
                                                value="<?php echo $shipping_title; ?>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Page Content * </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="shipping_content"
                                                id="editor4"><?php echo $shipping_content; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Existing Banner Photo</label>
                                        <div class="col-sm-6" style="padding-top:6px;">
                                            <img src="../assets/uploads/<?php echo $shipping_banner; ?>"
                                                class="existing-photo" style="height:80px;">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">New Banner Photo</label>
                                        <div class="col-sm-6" style="padding-top:6px;">
                                            <input type="file" name="shipping_banner">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Title</label>
                                        <div class="col-sm-8">
                                            <input class="form-control" type="text" name="shipping_meta_title"
                                                value="<?php echo $shipping_meta_title; ?>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Keyword </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="shipping_meta_keyword"
                                                style="height:100px;"><?php echo $shipping_meta_keyword; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Description </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="shipping_meta_description"
                                                style="height:100px;"><?php echo $shipping_meta_description; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label"></label>
                                        <div class="col-sm-6">
                                            <button type="submit" class="btn btn-success pull-left"
                                                name="form_shipping">Update</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>



                    <!-- terms Policy -->
                    <div class="tab-pane " id="tab_7">
                        <form class="form-horizontal" action="" method="post" enctype="multipart/form-data">
                            <div class="box box-info">
                                <div class="box-body">
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Page Title * </label>
                                        <div class="col-sm-5">
                                            <input class="form-control" type="text" name="terms_title"
                                                value="<?php echo $terms_title; ?>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Page Content * </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="terms_content"
                                                id="editor5"><?php echo $terms_content; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Existing Banner Photo</label>
                                        <div class="col-sm-6" style="padding-top:6px;">
                                            <img src="../assets/uploads/<?php echo $terms_banner; ?>"
                                                class="existing-photo" style="height:80px;">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">New Banner Photo</label>
                                        <div class="col-sm-6" style="padding-top:6px;">
                                            <input type="file" name="terms_banner">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Title</label>
                                        <div class="col-sm-8">
                                            <input class="form-control" type="text" name="terms_meta_title"
                                                value="<?php echo $terms_meta_title; ?>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Keyword </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="terms_meta_keyword"
                                                style="height:100px;"><?php echo $terms_meta_keyword; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label">Meta Description </label>
                                        <div class="col-sm-8">
                                            <textarea class="form-control" name="terms_meta_description"
                                                style="height:100px;"><?php echo $terms_meta_description; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="" class="col-sm-3 control-label"></label>
                                        <div class="col-sm-6">
                                            <button type="submit" class="btn btn-success pull-left"
                                                name="form_terms">Update</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>





                    </form>
                </div>
            </div>

</section>

<?php require_once('footer.php'); ?>