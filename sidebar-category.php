<h4><?php echo LANG_VALUE_49; ?></h4>
<hr />
<div class="card-box">
    <div id="left" class="span3 md-6">
        <ul id="menu-group-1" class="nav menu">
            <?php
                        $i = 0;
                        $statement = $pdo->prepare("SELECT * FROM tbl_top_category WHERE show_on_menu=1");
                        $statement->execute();
                        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
                        foreach ($result as $row) {
                            $i++;
                        ?>
            <li class="cat-level-1 deeper parent">
                <a href="product-category.php?id=<?php echo $row['tcat_id']; ?>&type=top-category">
                    <span data-toggle="collapse" data-parent="#menu-group-1" href="#cat-lvl1-id-<?php echo $i; ?>"
                        class="sign"><i class="fa fa-plus"></i></span>
                    <span class="lbl"><?php echo $row['tcat_name']; ?></span>
                </a>
                <ul class="children nav-child unstyled small collapse" id="cat-lvl1-id-<?php echo $i; ?>">
                    <?php
                                    $j = 0;
                                    $statement1 = $pdo->prepare("SELECT * FROM tbl_mid_category WHERE tcat_id=?");
                                    $statement1->execute([$row['tcat_id']]);
                                    $result1 = $statement1->fetchAll(PDO::FETCH_ASSOC);
                                    foreach ($result1 as $row1) {
                                        $j++;
                                    ?>
                    <li class="deeper parent">
                        <a href="product-category.php?id=<?php echo $row1['mcat_id']; ?>&type=mid-category">
                            <span data-toggle="collapse" data-parent="#menu-group-1"
                                href="#cat-lvl2-id-<?php echo $i . $j; ?>" class="sign"><i
                                    class="fa fa-plus"></i></span>
                            <span class="lbl lbl1"><?php echo $row1['mcat_name']; ?></span>
                        </a>
                        <ul class="children nav-child unstyled small collapse" id="cat-lvl2-id-<?php echo $i . $j; ?>">
                            <?php
                                                $k = 0;
                                                $statement2 = $pdo->prepare("SELECT * FROM tbl_end_category WHERE mcat_id=?");
                                                $statement2->execute([$row1['mcat_id']]);
                                                $result2 = $statement2->fetchAll(PDO::FETCH_ASSOC);
                                                foreach ($result2 as $row2) {
                                                    $k++;
                                                ?>
                            <li class="item-<?php echo $i . $j . $k; ?>">
                                <a href="product-category.php?id=<?php echo $row2['ecat_id']; ?>&type=end-category">
                                    <span class="sign"></span>
                                    <span class="lbl lbl1"><?php echo $row2['ecat_name']; ?></span>
                                </a>
                            </li>
                            <?php } ?>
                        </ul>
                    </li>
                    <?php } ?>
                </ul>
            </li>
            <?php } ?>
        </ul>

        <div class="span3 md-6">
            <div class="filter-sidebar p-3 shadow-sm rounded bg-white">
                <h4 class="col-mb-9">Color</h4>
                <hr />
                <form id="filterForm" method="get" class="mb-3 d-flex gap-3 flex-wrap">
                    <input type="hidden" name="id" value="<?= htmlspecialchars($id) ?>">
                    <input type="hidden" name="type" value="<?= htmlspecialchars($type) ?>">

                    <div class="color-filter">
                        <?php
                                        $statement = $pdo->prepare("SELECT * FROM tbl_color");
                                        $statement->execute();
                                        $colors = $statement->fetchAll(PDO::FETCH_ASSOC);
                                        foreach ($colors as $row) {
                                            $color_code = $row['color_code'];
                                            $shape = $row['shape'];
                                            $border_radius = ($shape == 'circle') ? '50%' : '0';
                                        ?>
                        <div class="text-center">
                            <label style="cursor: pointer;">
                                <input type="radio" name="color" value="<?= $row['color_id'] ?>" style="display:none;"
                                    onchange="document.getElementById('filterForm').submit();">
                                <div class="color-box"
                                    style="width: 20px; height: 20px; background-color: <?= $color_code ?>; border-radius: <?= $border_radius ?>; border: 1px solid #999; margin: auto;">
                                </div>
                            </label>
                        </div>
                        <?php } ?>
                    </div>


                    <h4 class="mt-4 mb-3">Size</h4>
                    <hr />
                    <div class="size-box">
                        <?php
                                    $stmt = $pdo->prepare("SELECT * FROM tbl_size ORDER BY size_name ASC");
                                    $stmt->execute();
                                    $sizes = $stmt->fetchAll(PDO::FETCH_ASSOC);
                                    foreach ($sizes as $size) {
                                        echo '<button class="btn btn-outline-dark btn-sm" onclick="filterBySize(' . $size['size_id'] . ')">' . htmlspecialchars($size['size_name']) . '</button>';
                                    }
                                    ?>
                    </div>
                </form>

                <script>
                function filterBySize(sizeId) {
                    const form = document.getElementById('filterForm');
                    const sizeInput = document.createElement('input');
                    sizeInput.type = 'hidden';
                    sizeInput.name = 'size';
                    sizeInput.value = sizeId;
                    form.appendChild(sizeInput);
                    form.submit();
                }
                </script>




                <hr />
                <h4 class="mt-4 mb-3">Shop by Price</h4>
                <?php
                            $stmt = $pdo->prepare("SELECT MIN(p_current_price) AS min_price, MAX(p_current_price) AS max_price FROM tbl_product WHERE p_current_price > 0");
                            $stmt->execute();
                            $priceData = $stmt->fetch(PDO::FETCH_ASSOC);
                            $min_price = floor($priceData['min_price']);
                            $max_price = ceil($priceData['max_price']);
                            ?>
                <div>
                    <input type="range" class="form-range" id="priceRange" min="<?php echo $min_price; ?>"
                        max="<?php echo $max_price; ?>" value="<?php echo $max_price; ?>"
                        oninput="updatePriceLabel(this.value)">
                    <div class="d-flex justify-content-between mt-2">
                        <span><?php echo LANG_VALUE_1; ?> <?php echo $min_price; ?></span>
                        <span id="selectedPrice">-<?php echo LANG_VALUE_1; ?>
                            <?php echo $max_price; ?></span>
                    </div>
                </div>
                <hr />
            </div>
        </div>
    </div>
</div>