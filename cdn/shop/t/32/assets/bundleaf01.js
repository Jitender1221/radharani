(function () {
  var __webpack_modules__ = {
      5260: function (
        __unused_webpack_module,
        __webpack_exports__2,
        __webpack_require__2
      ) {
        "use strict";
        __webpack_require__2.r(__webpack_exports__2),
          __webpack_require__2.d(__webpack_exports__2, {
            arrow: function () {
              return arrow;
            },
            autoPlacement: function () {
              return autoPlacement;
            },
            autoUpdate: function () {
              return autoUpdate;
            },
            computePosition: function () {
              return floating_ui_dom_esm_computePosition;
            },
            detectOverflow: function () {
              return detectOverflow;
            },
            flip: function () {
              return flip;
            },
            getOverflowAncestors: function () {
              return getOverflowAncestors;
            },
            hide: function () {
              return hide;
            },
            inline: function () {
              return inline;
            },
            limitShift: function () {
              return limitShift;
            },
            offset: function () {
              return offset;
            },
            platform: function () {
              return platform;
            },
            shift: function () {
              return shift;
            },
            size: function () {
              return size;
            },
          });
        const sides = ["top", "right", "bottom", "left"],
          alignments = ["start", "end"],
          placements = sides.reduce(
            (acc, side) =>
              acc.concat(
                side,
                side + "-" + alignments[0],
                side + "-" + alignments[1]
              ),
            []
          ),
          min = Math.min,
          max = Math.max,
          round = Math.round,
          floor = Math.floor,
          createCoords = (v) => ({ x: v, y: v }),
          oppositeSideMap = {
            left: "right",
            right: "left",
            bottom: "top",
            top: "bottom",
          },
          oppositeAlignmentMap = { start: "end", end: "start" };
        function clamp(start, value, end) {
          return max(start, min(value, end));
        }
        function evaluate(value, param) {
          return typeof value == "function" ? value(param) : value;
        }
        function getSide(placement) {
          return placement.split("-")[0];
        }
        function getAlignment(placement) {
          return placement.split("-")[1];
        }
        function getOppositeAxis(axis) {
          return axis === "x" ? "y" : "x";
        }
        function getAxisLength(axis) {
          return axis === "y" ? "height" : "width";
        }
        function getSideAxis(placement) {
          return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
        }
        function getAlignmentAxis(placement) {
          return getOppositeAxis(getSideAxis(placement));
        }
        function getAlignmentSides(placement, rects, rtl) {
          rtl === void 0 && (rtl = !1);
          const alignment = getAlignment(placement),
            alignmentAxis = getAlignmentAxis(placement),
            length = getAxisLength(alignmentAxis);
          let mainAlignmentSide =
            alignmentAxis === "x"
              ? alignment === (rtl ? "end" : "start")
                ? "right"
                : "left"
              : alignment === "start"
              ? "bottom"
              : "top";
          return (
            rects.reference[length] > rects.floating[length] &&
              (mainAlignmentSide = getOppositePlacement(mainAlignmentSide)),
            [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)]
          );
        }
        function getExpandedPlacements(placement) {
          const oppositePlacement = getOppositePlacement(placement);
          return [
            getOppositeAlignmentPlacement(placement),
            oppositePlacement,
            getOppositeAlignmentPlacement(oppositePlacement),
          ];
        }
        function getOppositeAlignmentPlacement(placement) {
          return placement.replace(
            /start|end/g,
            (alignment) => oppositeAlignmentMap[alignment]
          );
        }
        function getSideList(side, isStart, rtl) {
          const lr = ["left", "right"],
            rl = ["right", "left"],
            tb = ["top", "bottom"],
            bt = ["bottom", "top"];
          switch (side) {
            case "top":
            case "bottom":
              return rtl ? (isStart ? rl : lr) : isStart ? lr : rl;
            case "left":
            case "right":
              return isStart ? tb : bt;
            default:
              return [];
          }
        }
        function getOppositeAxisPlacements(
          placement,
          flipAlignment,
          direction,
          rtl
        ) {
          const alignment = getAlignment(placement);
          let list = getSideList(
            getSide(placement),
            direction === "start",
            rtl
          );
          return (
            alignment &&
              ((list = list.map((side) => side + "-" + alignment)),
              flipAlignment &&
                (list = list.concat(list.map(getOppositeAlignmentPlacement)))),
            list
          );
        }
        function getOppositePlacement(placement) {
          return placement.replace(
            /left|right|bottom|top/g,
            (side) => oppositeSideMap[side]
          );
        }
        function expandPaddingObject(padding) {
          return { top: 0, right: 0, bottom: 0, left: 0, ...padding };
        }
        function getPaddingObject(padding) {
          return typeof padding != "number"
            ? expandPaddingObject(padding)
            : { top: padding, right: padding, bottom: padding, left: padding };
        }
        function rectToClientRect(rect) {
          return {
            ...rect,
            top: rect.y,
            left: rect.x,
            right: rect.x + rect.width,
            bottom: rect.y + rect.height,
          };
        }
        function computeCoordsFromPlacement(_ref, placement, rtl) {
          let { reference, floating } = _ref;
          const sideAxis = getSideAxis(placement),
            alignmentAxis = getAlignmentAxis(placement),
            alignLength = getAxisLength(alignmentAxis),
            side = getSide(placement),
            isVertical = sideAxis === "y",
            commonX = reference.x + reference.width / 2 - floating.width / 2,
            commonY = reference.y + reference.height / 2 - floating.height / 2,
            commonAlign =
              reference[alignLength] / 2 - floating[alignLength] / 2;
          let coords;
          switch (side) {
            case "top":
              coords = { x: commonX, y: reference.y - floating.height };
              break;
            case "bottom":
              coords = { x: commonX, y: reference.y + reference.height };
              break;
            case "right":
              coords = { x: reference.x + reference.width, y: commonY };
              break;
            case "left":
              coords = { x: reference.x - floating.width, y: commonY };
              break;
            default:
              coords = { x: reference.x, y: reference.y };
          }
          switch (getAlignment(placement)) {
            case "start":
              coords[alignmentAxis] -=
                commonAlign * (rtl && isVertical ? -1 : 1);
              break;
            case "end":
              coords[alignmentAxis] +=
                commonAlign * (rtl && isVertical ? -1 : 1);
              break;
          }
          return coords;
        }
        const computePosition = async (reference, floating, config) => {
          const {
              placement = "bottom",
              strategy = "absolute",
              middleware = [],
              platform: platform2,
            } = config,
            validMiddleware = middleware.filter(Boolean),
            rtl = await (platform2.isRTL == null
              ? void 0
              : platform2.isRTL(floating));
          let rects = await platform2.getElementRects({
              reference,
              floating,
              strategy,
            }),
            { x, y } = computeCoordsFromPlacement(rects, placement, rtl),
            statefulPlacement = placement,
            middlewareData = {},
            resetCount = 0;
          for (let i = 0; i < validMiddleware.length; i++) {
            const { name, fn } = validMiddleware[i],
              {
                x: nextX,
                y: nextY,
                data,
                reset,
              } = await fn({
                x,
                y,
                initialPlacement: placement,
                placement: statefulPlacement,
                strategy,
                middlewareData,
                rects,
                platform: platform2,
                elements: { reference, floating },
              });
            if (
              ((x = nextX ?? x),
              (y = nextY ?? y),
              (middlewareData = {
                ...middlewareData,
                [name]: { ...middlewareData[name], ...data },
              }),
              reset && resetCount <= 50)
            ) {
              resetCount++,
                typeof reset == "object" &&
                  (reset.placement && (statefulPlacement = reset.placement),
                  reset.rects &&
                    (rects =
                      reset.rects === !0
                        ? await platform2.getElementRects({
                            reference,
                            floating,
                            strategy,
                          })
                        : reset.rects),
                  ({ x, y } = computeCoordsFromPlacement(
                    rects,
                    statefulPlacement,
                    rtl
                  ))),
                (i = -1);
              continue;
            }
          }
          return {
            x,
            y,
            placement: statefulPlacement,
            strategy,
            middlewareData,
          };
        };
        async function detectOverflow(state, options) {
          var _await$platform$isEle;
          options === void 0 && (options = {});
          const {
              x,
              y,
              platform: platform2,
              rects,
              elements,
              strategy,
            } = state,
            {
              boundary = "clippingAncestors",
              rootBoundary = "viewport",
              elementContext = "floating",
              altBoundary = !1,
              padding = 0,
            } = evaluate(options, state),
            paddingObject = getPaddingObject(padding),
            element =
              elements[
                altBoundary
                  ? elementContext === "floating"
                    ? "reference"
                    : "floating"
                  : elementContext
              ],
            clippingClientRect = rectToClientRect(
              await platform2.getClippingRect({
                element:
                  (_await$platform$isEle = await (platform2.isElement == null
                    ? void 0
                    : platform2.isElement(element))) == null ||
                  _await$platform$isEle
                    ? element
                    : element.contextElement ||
                      (await (platform2.getDocumentElement == null
                        ? void 0
                        : platform2.getDocumentElement(elements.floating))),
                boundary,
                rootBoundary,
                strategy,
              })
            ),
            rect =
              elementContext === "floating"
                ? { ...rects.floating, x, y }
                : rects.reference,
            offsetParent = await (platform2.getOffsetParent == null
              ? void 0
              : platform2.getOffsetParent(elements.floating)),
            offsetScale = (await (platform2.isElement == null
              ? void 0
              : platform2.isElement(offsetParent)))
              ? (await (platform2.getScale == null
                  ? void 0
                  : platform2.getScale(offsetParent))) || { x: 1, y: 1 }
              : { x: 1, y: 1 },
            elementClientRect = rectToClientRect(
              platform2.convertOffsetParentRelativeRectToViewportRelativeRect
                ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect(
                    { rect, offsetParent, strategy }
                  )
                : rect
            );
          return {
            top:
              (clippingClientRect.top -
                elementClientRect.top +
                paddingObject.top) /
              offsetScale.y,
            bottom:
              (elementClientRect.bottom -
                clippingClientRect.bottom +
                paddingObject.bottom) /
              offsetScale.y,
            left:
              (clippingClientRect.left -
                elementClientRect.left +
                paddingObject.left) /
              offsetScale.x,
            right:
              (elementClientRect.right -
                clippingClientRect.right +
                paddingObject.right) /
              offsetScale.x,
          };
        }
        const arrow = (options) => ({
          name: "arrow",
          options,
          async fn(state) {
            const {
                x,
                y,
                placement,
                rects,
                platform: platform2,
                elements,
                middlewareData,
              } = state,
              { element, padding = 0 } = evaluate(options, state) || {};
            if (element == null) return {};
            const paddingObject = getPaddingObject(padding),
              coords = { x, y },
              axis = getAlignmentAxis(placement),
              length = getAxisLength(axis),
              arrowDimensions = await platform2.getDimensions(element),
              isYAxis = axis === "y",
              minProp = isYAxis ? "top" : "left",
              maxProp = isYAxis ? "bottom" : "right",
              clientProp = isYAxis ? "clientHeight" : "clientWidth",
              endDiff =
                rects.reference[length] +
                rects.reference[axis] -
                coords[axis] -
                rects.floating[length],
              startDiff = coords[axis] - rects.reference[axis],
              arrowOffsetParent = await (platform2.getOffsetParent == null
                ? void 0
                : platform2.getOffsetParent(element));
            let clientSize = arrowOffsetParent
              ? arrowOffsetParent[clientProp]
              : 0;
            (!clientSize ||
              !(await (platform2.isElement == null
                ? void 0
                : platform2.isElement(arrowOffsetParent)))) &&
              (clientSize =
                elements.floating[clientProp] || rects.floating[length]);
            const centerToReference = endDiff / 2 - startDiff / 2,
              largestPossiblePadding =
                clientSize / 2 - arrowDimensions[length] / 2 - 1,
              minPadding = min(paddingObject[minProp], largestPossiblePadding),
              maxPadding = min(paddingObject[maxProp], largestPossiblePadding),
              min$1 = minPadding,
              max2 = clientSize - arrowDimensions[length] - maxPadding,
              center =
                clientSize / 2 -
                arrowDimensions[length] / 2 +
                centerToReference,
              offset2 = clamp(min$1, center, max2),
              shouldAddOffset =
                !middlewareData.arrow &&
                getAlignment(placement) != null &&
                center != offset2 &&
                rects.reference[length] / 2 -
                  (center < min$1 ? minPadding : maxPadding) -
                  arrowDimensions[length] / 2 <
                  0,
              alignmentOffset = shouldAddOffset
                ? center < min$1
                  ? center - min$1
                  : center - max2
                : 0;
            return {
              [axis]: coords[axis] + alignmentOffset,
              data: {
                [axis]: offset2,
                centerOffset: center - offset2 - alignmentOffset,
                ...(shouldAddOffset && { alignmentOffset }),
              },
              reset: shouldAddOffset,
            };
          },
        });
        function getPlacementList(alignment, autoAlignment, allowedPlacements) {
          return (
            alignment
              ? [
                  ...allowedPlacements.filter(
                    (placement) => getAlignment(placement) === alignment
                  ),
                  ...allowedPlacements.filter(
                    (placement) => getAlignment(placement) !== alignment
                  ),
                ]
              : allowedPlacements.filter(
                  (placement) => getSide(placement) === placement
                )
          ).filter((placement) =>
            alignment
              ? getAlignment(placement) === alignment ||
                (autoAlignment
                  ? getOppositeAlignmentPlacement(placement) !== placement
                  : !1)
              : !0
          );
        }
        const autoPlacement = function (options) {
            return (
              options === void 0 && (options = {}),
              {
                name: "autoPlacement",
                options,
                async fn(state) {
                  var _middlewareData$autoP,
                    _middlewareData$autoP2,
                    _placementsThatFitOnE;
                  const {
                      rects,
                      middlewareData,
                      placement,
                      platform: platform2,
                      elements,
                    } = state,
                    {
                      crossAxis = !1,
                      alignment,
                      allowedPlacements = placements,
                      autoAlignment = !0,
                      ...detectOverflowOptions
                    } = evaluate(options, state),
                    placements$1 =
                      alignment !== void 0 || allowedPlacements === placements
                        ? getPlacementList(
                            alignment || null,
                            autoAlignment,
                            allowedPlacements
                          )
                        : allowedPlacements,
                    overflow = await detectOverflow(
                      state,
                      detectOverflowOptions
                    ),
                    currentIndex =
                      ((_middlewareData$autoP = middlewareData.autoPlacement) ==
                      null
                        ? void 0
                        : _middlewareData$autoP.index) || 0,
                    currentPlacement = placements$1[currentIndex];
                  if (currentPlacement == null) return {};
                  const alignmentSides = getAlignmentSides(
                    currentPlacement,
                    rects,
                    await (platform2.isRTL == null
                      ? void 0
                      : platform2.isRTL(elements.floating))
                  );
                  if (placement !== currentPlacement)
                    return { reset: { placement: placements$1[0] } };
                  const currentOverflows = [
                      overflow[getSide(currentPlacement)],
                      overflow[alignmentSides[0]],
                      overflow[alignmentSides[1]],
                    ],
                    allOverflows = [
                      ...(((_middlewareData$autoP2 =
                        middlewareData.autoPlacement) == null
                        ? void 0
                        : _middlewareData$autoP2.overflows) || []),
                      {
                        placement: currentPlacement,
                        overflows: currentOverflows,
                      },
                    ],
                    nextPlacement = placements$1[currentIndex + 1];
                  if (nextPlacement)
                    return {
                      data: {
                        index: currentIndex + 1,
                        overflows: allOverflows,
                      },
                      reset: { placement: nextPlacement },
                    };
                  const placementsSortedByMostSpace = allOverflows
                      .map((d) => {
                        const alignment2 = getAlignment(d.placement);
                        return [
                          d.placement,
                          alignment2 && crossAxis
                            ? d.overflows
                                .slice(0, 2)
                                .reduce((acc, v) => acc + v, 0)
                            : d.overflows[0],
                          d.overflows,
                        ];
                      })
                      .sort((a, b) => a[1] - b[1]),
                    resetPlacement =
                      ((_placementsThatFitOnE =
                        placementsSortedByMostSpace.filter((d) =>
                          d[2]
                            .slice(0, getAlignment(d[0]) ? 2 : 3)
                            .every((v) => v <= 0)
                        )[0]) == null
                        ? void 0
                        : _placementsThatFitOnE[0]) ||
                      placementsSortedByMostSpace[0][0];
                  return resetPlacement !== placement
                    ? {
                        data: {
                          index: currentIndex + 1,
                          overflows: allOverflows,
                        },
                        reset: { placement: resetPlacement },
                      }
                    : {};
                },
              }
            );
          },
          flip = function (options) {
            return (
              options === void 0 && (options = {}),
              {
                name: "flip",
                options,
                async fn(state) {
                  var _middlewareData$arrow, _middlewareData$flip;
                  const {
                      placement,
                      middlewareData,
                      rects,
                      initialPlacement,
                      platform: platform2,
                      elements,
                    } = state,
                    {
                      mainAxis: checkMainAxis = !0,
                      crossAxis: checkCrossAxis = !0,
                      fallbackPlacements: specifiedFallbackPlacements,
                      fallbackStrategy = "bestFit",
                      fallbackAxisSideDirection = "none",
                      flipAlignment = !0,
                      ...detectOverflowOptions
                    } = evaluate(options, state);
                  if (
                    (_middlewareData$arrow = middlewareData.arrow) != null &&
                    _middlewareData$arrow.alignmentOffset
                  )
                    return {};
                  const side = getSide(placement),
                    isBasePlacement =
                      getSide(initialPlacement) === initialPlacement,
                    rtl = await (platform2.isRTL == null
                      ? void 0
                      : platform2.isRTL(elements.floating)),
                    fallbackPlacements =
                      specifiedFallbackPlacements ||
                      (isBasePlacement || !flipAlignment
                        ? [getOppositePlacement(initialPlacement)]
                        : getExpandedPlacements(initialPlacement));
                  !specifiedFallbackPlacements &&
                    fallbackAxisSideDirection !== "none" &&
                    fallbackPlacements.push(
                      ...getOppositeAxisPlacements(
                        initialPlacement,
                        flipAlignment,
                        fallbackAxisSideDirection,
                        rtl
                      )
                    );
                  const placements2 = [initialPlacement, ...fallbackPlacements],
                    overflow = await detectOverflow(
                      state,
                      detectOverflowOptions
                    ),
                    overflows = [];
                  let overflowsData =
                    ((_middlewareData$flip = middlewareData.flip) == null
                      ? void 0
                      : _middlewareData$flip.overflows) || [];
                  if (
                    (checkMainAxis && overflows.push(overflow[side]),
                    checkCrossAxis)
                  ) {
                    const sides2 = getAlignmentSides(placement, rects, rtl);
                    overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
                  }
                  if (
                    ((overflowsData = [
                      ...overflowsData,
                      { placement, overflows },
                    ]),
                    !overflows.every((side2) => side2 <= 0))
                  ) {
                    var _middlewareData$flip2, _overflowsData$filter;
                    const nextIndex =
                        (((_middlewareData$flip2 = middlewareData.flip) == null
                          ? void 0
                          : _middlewareData$flip2.index) || 0) + 1,
                      nextPlacement = placements2[nextIndex];
                    if (nextPlacement)
                      return {
                        data: { index: nextIndex, overflows: overflowsData },
                        reset: { placement: nextPlacement },
                      };
                    let resetPlacement =
                      (_overflowsData$filter = overflowsData
                        .filter((d) => d.overflows[0] <= 0)
                        .sort((a, b) => a.overflows[1] - b.overflows[1])[0]) ==
                      null
                        ? void 0
                        : _overflowsData$filter.placement;
                    if (!resetPlacement)
                      switch (fallbackStrategy) {
                        case "bestFit": {
                          var _overflowsData$map$so;
                          const placement2 =
                            (_overflowsData$map$so = overflowsData
                              .map((d) => [
                                d.placement,
                                d.overflows
                                  .filter((overflow2) => overflow2 > 0)
                                  .reduce(
                                    (acc, overflow2) => acc + overflow2,
                                    0
                                  ),
                              ])
                              .sort((a, b) => a[1] - b[1])[0]) == null
                              ? void 0
                              : _overflowsData$map$so[0];
                          placement2 && (resetPlacement = placement2);
                          break;
                        }
                        case "initialPlacement":
                          resetPlacement = initialPlacement;
                          break;
                      }
                    if (placement !== resetPlacement)
                      return { reset: { placement: resetPlacement } };
                  }
                  return {};
                },
              }
            );
          };
        function getSideOffsets(overflow, rect) {
          return {
            top: overflow.top - rect.height,
            right: overflow.right - rect.width,
            bottom: overflow.bottom - rect.height,
            left: overflow.left - rect.width,
          };
        }
        function isAnySideFullyClipped(overflow) {
          return sides.some((side) => overflow[side] >= 0);
        }
        const hide = function (options) {
          return (
            options === void 0 && (options = {}),
            {
              name: "hide",
              options,
              async fn(state) {
                const { rects } = state,
                  { strategy = "referenceHidden", ...detectOverflowOptions } =
                    evaluate(options, state);
                switch (strategy) {
                  case "referenceHidden": {
                    const overflow = await detectOverflow(state, {
                        ...detectOverflowOptions,
                        elementContext: "reference",
                      }),
                      offsets = getSideOffsets(overflow, rects.reference);
                    return {
                      data: {
                        referenceHiddenOffsets: offsets,
                        referenceHidden: isAnySideFullyClipped(offsets),
                      },
                    };
                  }
                  case "escaped": {
                    const overflow = await detectOverflow(state, {
                        ...detectOverflowOptions,
                        altBoundary: !0,
                      }),
                      offsets = getSideOffsets(overflow, rects.floating);
                    return {
                      data: {
                        escapedOffsets: offsets,
                        escaped: isAnySideFullyClipped(offsets),
                      },
                    };
                  }
                  default:
                    return {};
                }
              },
            }
          );
        };
        function getBoundingRect(rects) {
          const minX = min(...rects.map((rect) => rect.left)),
            minY = min(...rects.map((rect) => rect.top)),
            maxX = max(...rects.map((rect) => rect.right)),
            maxY = max(...rects.map((rect) => rect.bottom));
          return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
        }
        function getRectsByLine(rects) {
          const sortedRects = rects.slice().sort((a, b) => a.y - b.y),
            groups = [];
          let prevRect = null;
          for (let i = 0; i < sortedRects.length; i++) {
            const rect = sortedRects[i];
            !prevRect || rect.y - prevRect.y > prevRect.height / 2
              ? groups.push([rect])
              : groups[groups.length - 1].push(rect),
              (prevRect = rect);
          }
          return groups.map((rect) => rectToClientRect(getBoundingRect(rect)));
        }
        const inline = function (options) {
          return (
            options === void 0 && (options = {}),
            {
              name: "inline",
              options,
              async fn(state) {
                const {
                    placement,
                    elements,
                    rects,
                    platform: platform2,
                    strategy,
                  } = state,
                  { padding = 2, x, y } = evaluate(options, state),
                  nativeClientRects = Array.from(
                    (await (platform2.getClientRects == null
                      ? void 0
                      : platform2.getClientRects(elements.reference))) || []
                  ),
                  clientRects = getRectsByLine(nativeClientRects),
                  fallback = rectToClientRect(
                    getBoundingRect(nativeClientRects)
                  ),
                  paddingObject = getPaddingObject(padding);
                function getBoundingClientRect2() {
                  if (
                    clientRects.length === 2 &&
                    clientRects[0].left > clientRects[1].right &&
                    x != null &&
                    y != null
                  )
                    return (
                      clientRects.find(
                        (rect) =>
                          x > rect.left - paddingObject.left &&
                          x < rect.right + paddingObject.right &&
                          y > rect.top - paddingObject.top &&
                          y < rect.bottom + paddingObject.bottom
                      ) || fallback
                    );
                  if (clientRects.length >= 2) {
                    if (getSideAxis(placement) === "y") {
                      const firstRect = clientRects[0],
                        lastRect = clientRects[clientRects.length - 1],
                        isTop = getSide(placement) === "top",
                        top2 = firstRect.top,
                        bottom2 = lastRect.bottom,
                        left2 = isTop ? firstRect.left : lastRect.left,
                        right2 = isTop ? firstRect.right : lastRect.right,
                        width2 = right2 - left2,
                        height2 = bottom2 - top2;
                      return {
                        top: top2,
                        bottom: bottom2,
                        left: left2,
                        right: right2,
                        width: width2,
                        height: height2,
                        x: left2,
                        y: top2,
                      };
                    }
                    const isLeftSide = getSide(placement) === "left",
                      maxRight = max(...clientRects.map((rect) => rect.right)),
                      minLeft = min(...clientRects.map((rect) => rect.left)),
                      measureRects = clientRects.filter((rect) =>
                        isLeftSide
                          ? rect.left === minLeft
                          : rect.right === maxRight
                      ),
                      top = measureRects[0].top,
                      bottom = measureRects[measureRects.length - 1].bottom,
                      left = minLeft,
                      right = maxRight,
                      width = right - left,
                      height = bottom - top;
                    return {
                      top,
                      bottom,
                      left,
                      right,
                      width,
                      height,
                      x: left,
                      y: top,
                    };
                  }
                  return fallback;
                }
                const resetRects = await platform2.getElementRects({
                  reference: { getBoundingClientRect: getBoundingClientRect2 },
                  floating: elements.floating,
                  strategy,
                });
                return rects.reference.x !== resetRects.reference.x ||
                  rects.reference.y !== resetRects.reference.y ||
                  rects.reference.width !== resetRects.reference.width ||
                  rects.reference.height !== resetRects.reference.height
                  ? { reset: { rects: resetRects } }
                  : {};
              },
            }
          );
        };
        async function convertValueToCoords(state, options) {
          const { placement, platform: platform2, elements } = state,
            rtl = await (platform2.isRTL == null
              ? void 0
              : platform2.isRTL(elements.floating)),
            side = getSide(placement),
            alignment = getAlignment(placement),
            isVertical = getSideAxis(placement) === "y",
            mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1,
            crossAxisMulti = rtl && isVertical ? -1 : 1,
            rawValue = evaluate(options, state);
          let { mainAxis, crossAxis, alignmentAxis } =
            typeof rawValue == "number"
              ? { mainAxis: rawValue, crossAxis: 0, alignmentAxis: null }
              : { mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...rawValue };
          return (
            alignment &&
              typeof alignmentAxis == "number" &&
              (crossAxis =
                alignment === "end" ? alignmentAxis * -1 : alignmentAxis),
            isVertical
              ? { x: crossAxis * crossAxisMulti, y: mainAxis * mainAxisMulti }
              : { x: mainAxis * mainAxisMulti, y: crossAxis * crossAxisMulti }
          );
        }
        const offset = function (options) {
            return (
              options === void 0 && (options = 0),
              {
                name: "offset",
                options,
                async fn(state) {
                  const { x, y } = state,
                    diffCoords = await convertValueToCoords(state, options);
                  return {
                    x: x + diffCoords.x,
                    y: y + diffCoords.y,
                    data: diffCoords,
                  };
                },
              }
            );
          },
          shift = function (options) {
            return (
              options === void 0 && (options = {}),
              {
                name: "shift",
                options,
                async fn(state) {
                  const { x, y, placement } = state,
                    {
                      mainAxis: checkMainAxis = !0,
                      crossAxis: checkCrossAxis = !1,
                      limiter = {
                        fn: (_ref) => {
                          let { x: x2, y: y2 } = _ref;
                          return { x: x2, y: y2 };
                        },
                      },
                      ...detectOverflowOptions
                    } = evaluate(options, state),
                    coords = { x, y },
                    overflow = await detectOverflow(
                      state,
                      detectOverflowOptions
                    ),
                    crossAxis = getSideAxis(getSide(placement)),
                    mainAxis = getOppositeAxis(crossAxis);
                  let mainAxisCoord = coords[mainAxis],
                    crossAxisCoord = coords[crossAxis];
                  if (checkMainAxis) {
                    const minSide = mainAxis === "y" ? "top" : "left",
                      maxSide = mainAxis === "y" ? "bottom" : "right",
                      min2 = mainAxisCoord + overflow[minSide],
                      max2 = mainAxisCoord - overflow[maxSide];
                    mainAxisCoord = clamp(min2, mainAxisCoord, max2);
                  }
                  if (checkCrossAxis) {
                    const minSide = crossAxis === "y" ? "top" : "left",
                      maxSide = crossAxis === "y" ? "bottom" : "right",
                      min2 = crossAxisCoord + overflow[minSide],
                      max2 = crossAxisCoord - overflow[maxSide];
                    crossAxisCoord = clamp(min2, crossAxisCoord, max2);
                  }
                  const limitedCoords = limiter.fn({
                    ...state,
                    [mainAxis]: mainAxisCoord,
                    [crossAxis]: crossAxisCoord,
                  });
                  return {
                    ...limitedCoords,
                    data: { x: limitedCoords.x - x, y: limitedCoords.y - y },
                  };
                },
              }
            );
          },
          limitShift = function (options) {
            return (
              options === void 0 && (options = {}),
              {
                options,
                fn(state) {
                  const { x, y, placement, rects, middlewareData } = state,
                    {
                      offset: offset2 = 0,
                      mainAxis: checkMainAxis = !0,
                      crossAxis: checkCrossAxis = !0,
                    } = evaluate(options, state),
                    coords = { x, y },
                    crossAxis = getSideAxis(placement),
                    mainAxis = getOppositeAxis(crossAxis);
                  let mainAxisCoord = coords[mainAxis],
                    crossAxisCoord = coords[crossAxis];
                  const rawOffset = evaluate(offset2, state),
                    computedOffset =
                      typeof rawOffset == "number"
                        ? { mainAxis: rawOffset, crossAxis: 0 }
                        : { mainAxis: 0, crossAxis: 0, ...rawOffset };
                  if (checkMainAxis) {
                    const len = mainAxis === "y" ? "height" : "width",
                      limitMin =
                        rects.reference[mainAxis] -
                        rects.floating[len] +
                        computedOffset.mainAxis,
                      limitMax =
                        rects.reference[mainAxis] +
                        rects.reference[len] -
                        computedOffset.mainAxis;
                    mainAxisCoord < limitMin
                      ? (mainAxisCoord = limitMin)
                      : mainAxisCoord > limitMax && (mainAxisCoord = limitMax);
                  }
                  if (checkCrossAxis) {
                    var _middlewareData$offse, _middlewareData$offse2;
                    const len = mainAxis === "y" ? "width" : "height",
                      isOriginSide = ["top", "left"].includes(
                        getSide(placement)
                      ),
                      limitMin =
                        rects.reference[crossAxis] -
                        rects.floating[len] +
                        ((isOriginSide &&
                          ((_middlewareData$offse = middlewareData.offset) ==
                          null
                            ? void 0
                            : _middlewareData$offse[crossAxis])) ||
                          0) +
                        (isOriginSide ? 0 : computedOffset.crossAxis),
                      limitMax =
                        rects.reference[crossAxis] +
                        rects.reference[len] +
                        (isOriginSide
                          ? 0
                          : ((_middlewareData$offse2 = middlewareData.offset) ==
                            null
                              ? void 0
                              : _middlewareData$offse2[crossAxis]) || 0) -
                        (isOriginSide ? computedOffset.crossAxis : 0);
                    crossAxisCoord < limitMin
                      ? (crossAxisCoord = limitMin)
                      : crossAxisCoord > limitMax &&
                        (crossAxisCoord = limitMax);
                  }
                  return {
                    [mainAxis]: mainAxisCoord,
                    [crossAxis]: crossAxisCoord,
                  };
                },
              }
            );
          },
          size = function (options) {
            return (
              options === void 0 && (options = {}),
              {
                name: "size",
                options,
                async fn(state) {
                  const {
                      placement,
                      rects,
                      platform: platform2,
                      elements,
                    } = state,
                    { apply = () => {}, ...detectOverflowOptions } = evaluate(
                      options,
                      state
                    ),
                    overflow = await detectOverflow(
                      state,
                      detectOverflowOptions
                    ),
                    side = getSide(placement),
                    alignment = getAlignment(placement),
                    isYAxis = getSideAxis(placement) === "y",
                    { width, height } = rects.floating;
                  let heightSide, widthSide;
                  side === "top" || side === "bottom"
                    ? ((heightSide = side),
                      (widthSide =
                        alignment ===
                        ((await (platform2.isRTL == null
                          ? void 0
                          : platform2.isRTL(elements.floating)))
                          ? "start"
                          : "end")
                          ? "left"
                          : "right"))
                    : ((widthSide = side),
                      (heightSide = alignment === "end" ? "top" : "bottom"));
                  const overflowAvailableHeight = height - overflow[heightSide],
                    overflowAvailableWidth = width - overflow[widthSide],
                    noShift = !state.middlewareData.shift;
                  let availableHeight = overflowAvailableHeight,
                    availableWidth = overflowAvailableWidth;
                  if (isYAxis) {
                    const maximumClippingWidth =
                      width - overflow.left - overflow.right;
                    availableWidth =
                      alignment || noShift
                        ? min(overflowAvailableWidth, maximumClippingWidth)
                        : maximumClippingWidth;
                  } else {
                    const maximumClippingHeight =
                      height - overflow.top - overflow.bottom;
                    availableHeight =
                      alignment || noShift
                        ? min(overflowAvailableHeight, maximumClippingHeight)
                        : maximumClippingHeight;
                  }
                  if (noShift && !alignment) {
                    const xMin = max(overflow.left, 0),
                      xMax = max(overflow.right, 0),
                      yMin = max(overflow.top, 0),
                      yMax = max(overflow.bottom, 0);
                    isYAxis
                      ? (availableWidth =
                          width -
                          2 *
                            (xMin !== 0 || xMax !== 0
                              ? xMin + xMax
                              : max(overflow.left, overflow.right)))
                      : (availableHeight =
                          height -
                          2 *
                            (yMin !== 0 || yMax !== 0
                              ? yMin + yMax
                              : max(overflow.top, overflow.bottom)));
                  }
                  await apply({ ...state, availableWidth, availableHeight });
                  const nextDimensions = await platform2.getDimensions(
                    elements.floating
                  );
                  return width !== nextDimensions.width ||
                    height !== nextDimensions.height
                    ? { reset: { rects: !0 } }
                    : {};
                },
              }
            );
          };
        function getNodeName(node) {
          return isNode(node)
            ? (node.nodeName || "").toLowerCase()
            : "#document";
        }
        function getWindow(node) {
          var _node$ownerDocument;
          return (
            (node == null || (_node$ownerDocument = node.ownerDocument) == null
              ? void 0
              : _node$ownerDocument.defaultView) || window
          );
        }
        function getDocumentElement(node) {
          var _ref;
          return (_ref =
            (isNode(node) ? node.ownerDocument : node.document) ||
            window.document) == null
            ? void 0
            : _ref.documentElement;
        }
        function isNode(value) {
          return (
            value instanceof Node || value instanceof getWindow(value).Node
          );
        }
        function isElement(value) {
          return (
            value instanceof Element ||
            value instanceof getWindow(value).Element
          );
        }
        function isHTMLElement(value) {
          return (
            value instanceof HTMLElement ||
            value instanceof getWindow(value).HTMLElement
          );
        }
        function isShadowRoot(value) {
          return typeof ShadowRoot > "u"
            ? !1
            : value instanceof ShadowRoot ||
                value instanceof getWindow(value).ShadowRoot;
        }
        function isOverflowElement(element) {
          const { overflow, overflowX, overflowY, display } =
            getComputedStyle2(element);
          return (
            /auto|scroll|overlay|hidden|clip/.test(
              overflow + overflowY + overflowX
            ) && !["inline", "contents"].includes(display)
          );
        }
        function isTableElement(element) {
          return ["table", "td", "th"].includes(getNodeName(element));
        }
        function isContainingBlock(element) {
          const webkit = isWebKit(),
            css = getComputedStyle2(element);
          return (
            css.transform !== "none" ||
            css.perspective !== "none" ||
            (css.containerType ? css.containerType !== "normal" : !1) ||
            (!webkit &&
              (css.backdropFilter ? css.backdropFilter !== "none" : !1)) ||
            (!webkit && (css.filter ? css.filter !== "none" : !1)) ||
            ["transform", "perspective", "filter"].some((value) =>
              (css.willChange || "").includes(value)
            ) ||
            ["paint", "layout", "strict", "content"].some((value) =>
              (css.contain || "").includes(value)
            )
          );
        }
        function getContainingBlock(element) {
          let currentNode = getParentNode(element);
          for (
            ;
            isHTMLElement(currentNode) && !isLastTraversableNode(currentNode);

          ) {
            if (isContainingBlock(currentNode)) return currentNode;
            currentNode = getParentNode(currentNode);
          }
          return null;
        }
        function isWebKit() {
          return typeof CSS > "u" || !CSS.supports
            ? !1
            : CSS.supports("-webkit-backdrop-filter", "none");
        }
        function isLastTraversableNode(node) {
          return ["html", "body", "#document"].includes(getNodeName(node));
        }
        function getComputedStyle2(element) {
          return getWindow(element).getComputedStyle(element);
        }
        function getNodeScroll(element) {
          return isElement(element)
            ? { scrollLeft: element.scrollLeft, scrollTop: element.scrollTop }
            : {
                scrollLeft: element.pageXOffset,
                scrollTop: element.pageYOffset,
              };
        }
        function getParentNode(node) {
          if (getNodeName(node) === "html") return node;
          const result =
            node.assignedSlot ||
            node.parentNode ||
            (isShadowRoot(node) && node.host) ||
            getDocumentElement(node);
          return isShadowRoot(result) ? result.host : result;
        }
        function getNearestOverflowAncestor(node) {
          const parentNode = getParentNode(node);
          return isLastTraversableNode(parentNode)
            ? node.ownerDocument
              ? node.ownerDocument.body
              : node.body
            : isHTMLElement(parentNode) && isOverflowElement(parentNode)
            ? parentNode
            : getNearestOverflowAncestor(parentNode);
        }
        function getOverflowAncestors(node, list, traverseIframes) {
          var _node$ownerDocument2;
          list === void 0 && (list = []),
            traverseIframes === void 0 && (traverseIframes = !0);
          const scrollableAncestor = getNearestOverflowAncestor(node),
            isBody =
              scrollableAncestor ===
              ((_node$ownerDocument2 = node.ownerDocument) == null
                ? void 0
                : _node$ownerDocument2.body),
            win = getWindow(scrollableAncestor);
          return isBody
            ? list.concat(
                win,
                win.visualViewport || [],
                isOverflowElement(scrollableAncestor) ? scrollableAncestor : [],
                win.frameElement && traverseIframes
                  ? getOverflowAncestors(win.frameElement)
                  : []
              )
            : list.concat(
                scrollableAncestor,
                getOverflowAncestors(scrollableAncestor, [], traverseIframes)
              );
        }
        function getCssDimensions(element) {
          const css = getComputedStyle2(element);
          let width = parseFloat(css.width) || 0,
            height = parseFloat(css.height) || 0;
          const hasOffset = isHTMLElement(element),
            offsetWidth = hasOffset ? element.offsetWidth : width,
            offsetHeight = hasOffset ? element.offsetHeight : height,
            shouldFallback =
              round(width) !== offsetWidth || round(height) !== offsetHeight;
          return (
            shouldFallback && ((width = offsetWidth), (height = offsetHeight)),
            { width, height, $: shouldFallback }
          );
        }
        function unwrapElement(element) {
          return isElement(element) ? element : element.contextElement;
        }
        function getScale(element) {
          const domElement = unwrapElement(element);
          if (!isHTMLElement(domElement)) return createCoords(1);
          const rect = domElement.getBoundingClientRect(),
            { width, height, $ } = getCssDimensions(domElement);
          let x = ($ ? round(rect.width) : rect.width) / width,
            y = ($ ? round(rect.height) : rect.height) / height;
          return (
            (!x || !Number.isFinite(x)) && (x = 1),
            (!y || !Number.isFinite(y)) && (y = 1),
            { x, y }
          );
        }
        const noOffsets = createCoords(0);
        function getVisualOffsets(element) {
          const win = getWindow(element);
          return !isWebKit() || !win.visualViewport
            ? noOffsets
            : {
                x: win.visualViewport.offsetLeft,
                y: win.visualViewport.offsetTop,
              };
        }
        function shouldAddVisualOffsets(
          element,
          isFixed,
          floatingOffsetParent
        ) {
          return (
            isFixed === void 0 && (isFixed = !1),
            !floatingOffsetParent ||
            (isFixed && floatingOffsetParent !== getWindow(element))
              ? !1
              : isFixed
          );
        }
        function getBoundingClientRect(
          element,
          includeScale,
          isFixedStrategy,
          offsetParent
        ) {
          includeScale === void 0 && (includeScale = !1),
            isFixedStrategy === void 0 && (isFixedStrategy = !1);
          const clientRect = element.getBoundingClientRect(),
            domElement = unwrapElement(element);
          let scale = createCoords(1);
          includeScale &&
            (offsetParent
              ? isElement(offsetParent) && (scale = getScale(offsetParent))
              : (scale = getScale(element)));
          const visualOffsets = shouldAddVisualOffsets(
            domElement,
            isFixedStrategy,
            offsetParent
          )
            ? getVisualOffsets(domElement)
            : createCoords(0);
          let x = (clientRect.left + visualOffsets.x) / scale.x,
            y = (clientRect.top + visualOffsets.y) / scale.y,
            width = clientRect.width / scale.x,
            height = clientRect.height / scale.y;
          if (domElement) {
            const win = getWindow(domElement),
              offsetWin =
                offsetParent && isElement(offsetParent)
                  ? getWindow(offsetParent)
                  : offsetParent;
            let currentIFrame = win.frameElement;
            for (; currentIFrame && offsetParent && offsetWin !== win; ) {
              const iframeScale = getScale(currentIFrame),
                iframeRect = currentIFrame.getBoundingClientRect(),
                css = getComputedStyle2(currentIFrame),
                left =
                  iframeRect.left +
                  (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) *
                    iframeScale.x,
                top =
                  iframeRect.top +
                  (currentIFrame.clientTop + parseFloat(css.paddingTop)) *
                    iframeScale.y;
              (x *= iframeScale.x),
                (y *= iframeScale.y),
                (width *= iframeScale.x),
                (height *= iframeScale.y),
                (x += left),
                (y += top),
                (currentIFrame = getWindow(currentIFrame).frameElement);
            }
          }
          return rectToClientRect({ width, height, x, y });
        }
        function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
          let { rect, offsetParent, strategy } = _ref;
          const isOffsetParentAnElement = isHTMLElement(offsetParent),
            documentElement = getDocumentElement(offsetParent);
          if (offsetParent === documentElement) return rect;
          let scroll = { scrollLeft: 0, scrollTop: 0 },
            scale = createCoords(1);
          const offsets = createCoords(0);
          if (
            (isOffsetParentAnElement ||
              (!isOffsetParentAnElement && strategy !== "fixed")) &&
            ((getNodeName(offsetParent) !== "body" ||
              isOverflowElement(documentElement)) &&
              (scroll = getNodeScroll(offsetParent)),
            isHTMLElement(offsetParent))
          ) {
            const offsetRect = getBoundingClientRect(offsetParent);
            (scale = getScale(offsetParent)),
              (offsets.x = offsetRect.x + offsetParent.clientLeft),
              (offsets.y = offsetRect.y + offsetParent.clientTop);
          }
          return {
            width: rect.width * scale.x,
            height: rect.height * scale.y,
            x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
            y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y,
          };
        }
        function getClientRects(element) {
          return Array.from(element.getClientRects());
        }
        function getWindowScrollBarX(element) {
          return (
            getBoundingClientRect(getDocumentElement(element)).left +
            getNodeScroll(element).scrollLeft
          );
        }
        function getDocumentRect(element) {
          const html = getDocumentElement(element),
            scroll = getNodeScroll(element),
            body = element.ownerDocument.body,
            width = max(
              html.scrollWidth,
              html.clientWidth,
              body.scrollWidth,
              body.clientWidth
            ),
            height = max(
              html.scrollHeight,
              html.clientHeight,
              body.scrollHeight,
              body.clientHeight
            );
          let x = -scroll.scrollLeft + getWindowScrollBarX(element);
          const y = -scroll.scrollTop;
          return (
            getComputedStyle2(body).direction === "rtl" &&
              (x += max(html.clientWidth, body.clientWidth) - width),
            { width, height, x, y }
          );
        }
        function getViewportRect(element, strategy) {
          const win = getWindow(element),
            html = getDocumentElement(element),
            visualViewport = win.visualViewport;
          let width = html.clientWidth,
            height = html.clientHeight,
            x = 0,
            y = 0;
          if (visualViewport) {
            (width = visualViewport.width), (height = visualViewport.height);
            const visualViewportBased = isWebKit();
            (!visualViewportBased ||
              (visualViewportBased && strategy === "fixed")) &&
              ((x = visualViewport.offsetLeft), (y = visualViewport.offsetTop));
          }
          return { width, height, x, y };
        }
        function getInnerBoundingClientRect(element, strategy) {
          const clientRect = getBoundingClientRect(
              element,
              !0,
              strategy === "fixed"
            ),
            top = clientRect.top + element.clientTop,
            left = clientRect.left + element.clientLeft,
            scale = isHTMLElement(element)
              ? getScale(element)
              : createCoords(1),
            width = element.clientWidth * scale.x,
            height = element.clientHeight * scale.y,
            x = left * scale.x,
            y = top * scale.y;
          return { width, height, x, y };
        }
        function getClientRectFromClippingAncestor(
          element,
          clippingAncestor,
          strategy
        ) {
          let rect;
          if (clippingAncestor === "viewport")
            rect = getViewportRect(element, strategy);
          else if (clippingAncestor === "document")
            rect = getDocumentRect(getDocumentElement(element));
          else if (isElement(clippingAncestor))
            rect = getInnerBoundingClientRect(clippingAncestor, strategy);
          else {
            const visualOffsets = getVisualOffsets(element);
            rect = {
              ...clippingAncestor,
              x: clippingAncestor.x - visualOffsets.x,
              y: clippingAncestor.y - visualOffsets.y,
            };
          }
          return rectToClientRect(rect);
        }
        function hasFixedPositionAncestor(element, stopNode) {
          const parentNode = getParentNode(element);
          return parentNode === stopNode ||
            !isElement(parentNode) ||
            isLastTraversableNode(parentNode)
            ? !1
            : getComputedStyle2(parentNode).position === "fixed" ||
                hasFixedPositionAncestor(parentNode, stopNode);
        }
        function getClippingElementAncestors(element, cache) {
          const cachedResult = cache.get(element);
          if (cachedResult) return cachedResult;
          let result = getOverflowAncestors(element, [], !1).filter(
              (el) => isElement(el) && getNodeName(el) !== "body"
            ),
            currentContainingBlockComputedStyle = null;
          const elementIsFixed =
            getComputedStyle2(element).position === "fixed";
          let currentNode = elementIsFixed ? getParentNode(element) : element;
          for (
            ;
            isElement(currentNode) && !isLastTraversableNode(currentNode);

          ) {
            const computedStyle = getComputedStyle2(currentNode),
              currentNodeIsContaining = isContainingBlock(currentNode);
            !currentNodeIsContaining &&
              computedStyle.position === "fixed" &&
              (currentContainingBlockComputedStyle = null),
              (
                elementIsFixed
                  ? !currentNodeIsContaining &&
                    !currentContainingBlockComputedStyle
                  : (!currentNodeIsContaining &&
                      computedStyle.position === "static" &&
                      !!currentContainingBlockComputedStyle &&
                      ["absolute", "fixed"].includes(
                        currentContainingBlockComputedStyle.position
                      )) ||
                    (isOverflowElement(currentNode) &&
                      !currentNodeIsContaining &&
                      hasFixedPositionAncestor(element, currentNode))
              )
                ? (result = result.filter(
                    (ancestor) => ancestor !== currentNode
                  ))
                : (currentContainingBlockComputedStyle = computedStyle),
              (currentNode = getParentNode(currentNode));
          }
          return cache.set(element, result), result;
        }
        function getClippingRect(_ref) {
          let { element, boundary, rootBoundary, strategy } = _ref;
          const clippingAncestors = [
              ...(boundary === "clippingAncestors"
                ? getClippingElementAncestors(element, this._c)
                : [].concat(boundary)),
              rootBoundary,
            ],
            firstClippingAncestor = clippingAncestors[0],
            clippingRect = clippingAncestors.reduce(
              (accRect, clippingAncestor) => {
                const rect = getClientRectFromClippingAncestor(
                  element,
                  clippingAncestor,
                  strategy
                );
                return (
                  (accRect.top = max(rect.top, accRect.top)),
                  (accRect.right = min(rect.right, accRect.right)),
                  (accRect.bottom = min(rect.bottom, accRect.bottom)),
                  (accRect.left = max(rect.left, accRect.left)),
                  accRect
                );
              },
              getClientRectFromClippingAncestor(
                element,
                firstClippingAncestor,
                strategy
              )
            );
          return {
            width: clippingRect.right - clippingRect.left,
            height: clippingRect.bottom - clippingRect.top,
            x: clippingRect.left,
            y: clippingRect.top,
          };
        }
        function getDimensions(element) {
          return getCssDimensions(element);
        }
        function getRectRelativeToOffsetParent(
          element,
          offsetParent,
          strategy
        ) {
          const isOffsetParentAnElement = isHTMLElement(offsetParent),
            documentElement = getDocumentElement(offsetParent),
            isFixed = strategy === "fixed",
            rect = getBoundingClientRect(element, !0, isFixed, offsetParent);
          let scroll = { scrollLeft: 0, scrollTop: 0 };
          const offsets = createCoords(0);
          if (isOffsetParentAnElement || (!isOffsetParentAnElement && !isFixed))
            if (
              ((getNodeName(offsetParent) !== "body" ||
                isOverflowElement(documentElement)) &&
                (scroll = getNodeScroll(offsetParent)),
              isOffsetParentAnElement)
            ) {
              const offsetRect = getBoundingClientRect(
                offsetParent,
                !0,
                isFixed,
                offsetParent
              );
              (offsets.x = offsetRect.x + offsetParent.clientLeft),
                (offsets.y = offsetRect.y + offsetParent.clientTop);
            } else
              documentElement &&
                (offsets.x = getWindowScrollBarX(documentElement));
          return {
            x: rect.left + scroll.scrollLeft - offsets.x,
            y: rect.top + scroll.scrollTop - offsets.y,
            width: rect.width,
            height: rect.height,
          };
        }
        function getTrueOffsetParent(element, polyfill) {
          return !isHTMLElement(element) ||
            getComputedStyle2(element).position === "fixed"
            ? null
            : polyfill
            ? polyfill(element)
            : element.offsetParent;
        }
        function getOffsetParent(element, polyfill) {
          const window2 = getWindow(element);
          if (!isHTMLElement(element)) return window2;
          let offsetParent = getTrueOffsetParent(element, polyfill);
          for (
            ;
            offsetParent &&
            isTableElement(offsetParent) &&
            getComputedStyle2(offsetParent).position === "static";

          )
            offsetParent = getTrueOffsetParent(offsetParent, polyfill);
          return offsetParent &&
            (getNodeName(offsetParent) === "html" ||
              (getNodeName(offsetParent) === "body" &&
                getComputedStyle2(offsetParent).position === "static" &&
                !isContainingBlock(offsetParent)))
            ? window2
            : offsetParent || getContainingBlock(element) || window2;
        }
        const getElementRects = async function (_ref) {
          let { reference, floating, strategy } = _ref;
          const getOffsetParentFn = this.getOffsetParent || getOffsetParent,
            getDimensionsFn = this.getDimensions;
          return {
            reference: getRectRelativeToOffsetParent(
              reference,
              await getOffsetParentFn(floating),
              strategy
            ),
            floating: { x: 0, y: 0, ...(await getDimensionsFn(floating)) },
          };
        };
        function isRTL(element) {
          return getComputedStyle2(element).direction === "rtl";
        }
        const platform = {
          convertOffsetParentRelativeRectToViewportRelativeRect,
          getDocumentElement,
          getClippingRect,
          getOffsetParent,
          getElementRects,
          getClientRects,
          getDimensions,
          getScale,
          isElement,
          isRTL,
        };
        function observeMove(element, onMove) {
          let io = null,
            timeoutId;
          const root = getDocumentElement(element);
          function cleanup() {
            clearTimeout(timeoutId), io && io.disconnect(), (io = null);
          }
          function refresh(skip, threshold) {
            skip === void 0 && (skip = !1),
              threshold === void 0 && (threshold = 1),
              cleanup();
            const { left, top, width, height } =
              element.getBoundingClientRect();
            if ((skip || onMove(), !width || !height)) return;
            const insetTop = floor(top),
              insetRight = floor(root.clientWidth - (left + width)),
              insetBottom = floor(root.clientHeight - (top + height)),
              insetLeft = floor(left),
              options = {
                rootMargin:
                  -insetTop +
                  "px " +
                  -insetRight +
                  "px " +
                  -insetBottom +
                  "px " +
                  -insetLeft +
                  "px",
                threshold: max(0, min(1, threshold)) || 1,
              };
            let isFirstUpdate = !0;
            function handleObserve(entries) {
              const ratio = entries[0].intersectionRatio;
              if (ratio !== threshold) {
                if (!isFirstUpdate) return refresh();
                ratio
                  ? refresh(!1, ratio)
                  : (timeoutId = setTimeout(() => {
                      refresh(!1, 1e-7);
                    }, 100));
              }
              isFirstUpdate = !1;
            }
            try {
              io = new IntersectionObserver(handleObserve, {
                ...options,
                root: root.ownerDocument,
              });
            } catch {
              io = new IntersectionObserver(handleObserve, options);
            }
            io.observe(element);
          }
          return refresh(!0), cleanup;
        }
        function autoUpdate(reference, floating, update, options) {
          options === void 0 && (options = {});
          const {
              ancestorScroll = !0,
              ancestorResize = !0,
              elementResize = typeof ResizeObserver == "function",
              layoutShift = typeof IntersectionObserver == "function",
              animationFrame = !1,
            } = options,
            referenceEl = unwrapElement(reference),
            ancestors =
              ancestorScroll || ancestorResize
                ? [
                    ...(referenceEl ? getOverflowAncestors(referenceEl) : []),
                    ...getOverflowAncestors(floating),
                  ]
                : [];
          ancestors.forEach((ancestor) => {
            ancestorScroll &&
              ancestor.addEventListener("scroll", update, { passive: !0 }),
              ancestorResize && ancestor.addEventListener("resize", update);
          });
          const cleanupIo =
            referenceEl && layoutShift
              ? observeMove(referenceEl, update)
              : null;
          let reobserveFrame = -1,
            resizeObserver = null;
          elementResize &&
            ((resizeObserver = new ResizeObserver((_ref) => {
              let [firstEntry] = _ref;
              firstEntry &&
                firstEntry.target === referenceEl &&
                resizeObserver &&
                (resizeObserver.unobserve(floating),
                cancelAnimationFrame(reobserveFrame),
                (reobserveFrame = requestAnimationFrame(() => {
                  resizeObserver && resizeObserver.observe(floating);
                }))),
                update();
            })),
            referenceEl &&
              !animationFrame &&
              resizeObserver.observe(referenceEl),
            resizeObserver.observe(floating));
          let frameId,
            prevRefRect = animationFrame
              ? getBoundingClientRect(reference)
              : null;
          animationFrame && frameLoop();
          function frameLoop() {
            const nextRefRect = getBoundingClientRect(reference);
            prevRefRect &&
              (nextRefRect.x !== prevRefRect.x ||
                nextRefRect.y !== prevRefRect.y ||
                nextRefRect.width !== prevRefRect.width ||
                nextRefRect.height !== prevRefRect.height) &&
              update(),
              (prevRefRect = nextRefRect),
              (frameId = requestAnimationFrame(frameLoop));
          }
          return (
            update(),
            () => {
              ancestors.forEach((ancestor) => {
                ancestorScroll &&
                  ancestor.removeEventListener("scroll", update),
                  ancestorResize &&
                    ancestor.removeEventListener("resize", update);
              }),
                cleanupIo && cleanupIo(),
                resizeObserver && resizeObserver.disconnect(),
                (resizeObserver = null),
                animationFrame && cancelAnimationFrame(frameId);
            }
          );
        }
        const floating_ui_dom_esm_computePosition = (
          reference,
          floating,
          options
        ) => {
          const cache = new Map(),
            mergedOptions = { platform, ...options },
            platformWithCache = { ...mergedOptions.platform, _c: cache };
          return computePosition(reference, floating, {
            ...mergedOptions,
            platform: platformWithCache,
          });
        };
      },
      3311: function (
        __unused_webpack_module,
        __webpack_exports__2,
        __webpack_require__2
      ) {
        "use strict";
        __webpack_require__2.r(__webpack_exports__2),
          __webpack_require__2.d(__webpack_exports__2, {
            DEFAULT_ID: function () {
              return DEFAULT_ID;
            },
            Loader: function () {
              return Loader;
            },
            LoaderStatus: function () {
              return LoaderStatus;
            },
          });
        /*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ function __awaiter(
          thisArg,
          _arguments,
          P,
          generator
        ) {
          function adopt(value) {
            return value instanceof P
              ? value
              : new P(function (resolve) {
                  resolve(value);
                });
          }
          return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject(e);
              }
            }
            function rejected(value) {
              try {
                step(generator.throw(value));
              } catch (e) {
                reject(e);
              }
            }
            function step(result) {
              result.done
                ? resolve(result.value)
                : adopt(result.value).then(fulfilled, rejected);
            }
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next()
            );
          });
        }
        var fastDeepEqual = function equal(a, b) {
          if (a === b) return !0;
          if (a && b && typeof a == "object" && typeof b == "object") {
            if (a.constructor !== b.constructor) return !1;
            var length, i, keys;
            if (Array.isArray(a)) {
              if (((length = a.length), length != b.length)) return !1;
              for (i = length; i-- !== 0; ) if (!equal(a[i], b[i])) return !1;
              return !0;
            }
            if (a.constructor === RegExp)
              return a.source === b.source && a.flags === b.flags;
            if (a.valueOf !== Object.prototype.valueOf)
              return a.valueOf() === b.valueOf();
            if (a.toString !== Object.prototype.toString)
              return a.toString() === b.toString();
            if (
              ((keys = Object.keys(a)),
              (length = keys.length),
              length !== Object.keys(b).length)
            )
              return !1;
            for (i = length; i-- !== 0; )
              if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return !1;
            for (i = length; i-- !== 0; ) {
              var key = keys[i];
              if (!equal(a[key], b[key])) return !1;
            }
            return !0;
          }
          return a !== a && b !== b;
        };
        const DEFAULT_ID = "__googleMapsScriptId";
        var LoaderStatus;
        (function (LoaderStatus2) {
          (LoaderStatus2[(LoaderStatus2.INITIALIZED = 0)] = "INITIALIZED"),
            (LoaderStatus2[(LoaderStatus2.LOADING = 1)] = "LOADING"),
            (LoaderStatus2[(LoaderStatus2.SUCCESS = 2)] = "SUCCESS"),
            (LoaderStatus2[(LoaderStatus2.FAILURE = 3)] = "FAILURE");
        })(LoaderStatus || (LoaderStatus = {}));
        class Loader {
          constructor({
            apiKey,
            authReferrerPolicy,
            channel,
            client,
            id = DEFAULT_ID,
            language,
            libraries = [],
            mapIds,
            nonce,
            region,
            retries = 3,
            url = "https://maps.googleapis.com/maps/api/js",
            version,
          }) {
            if (
              ((this.callbacks = []),
              (this.done = !1),
              (this.loading = !1),
              (this.errors = []),
              (this.apiKey = apiKey),
              (this.authReferrerPolicy = authReferrerPolicy),
              (this.channel = channel),
              (this.client = client),
              (this.id = id || DEFAULT_ID),
              (this.language = language),
              (this.libraries = libraries),
              (this.mapIds = mapIds),
              (this.nonce = nonce),
              (this.region = region),
              (this.retries = retries),
              (this.url = url),
              (this.version = version),
              Loader.instance)
            ) {
              if (!fastDeepEqual(this.options, Loader.instance.options))
                throw new Error(
                  `Loader must not be called again with different options. ${JSON.stringify(
                    this.options
                  )} !== ${JSON.stringify(Loader.instance.options)}`
                );
              return Loader.instance;
            }
            Loader.instance = this;
          }
          get options() {
            return {
              version: this.version,
              apiKey: this.apiKey,
              channel: this.channel,
              client: this.client,
              id: this.id,
              libraries: this.libraries,
              language: this.language,
              region: this.region,
              mapIds: this.mapIds,
              nonce: this.nonce,
              url: this.url,
              authReferrerPolicy: this.authReferrerPolicy,
            };
          }
          get status() {
            return this.errors.length
              ? LoaderStatus.FAILURE
              : this.done
              ? LoaderStatus.SUCCESS
              : this.loading
              ? LoaderStatus.LOADING
              : LoaderStatus.INITIALIZED;
          }
          get failed() {
            return (
              this.done &&
              !this.loading &&
              this.errors.length >= this.retries + 1
            );
          }
          createUrl() {
            let url = this.url;
            return (
              (url += "?callback=__googleMapsCallback"),
              this.apiKey && (url += `&key=${this.apiKey}`),
              this.channel && (url += `&channel=${this.channel}`),
              this.client && (url += `&client=${this.client}`),
              this.libraries.length > 0 &&
                (url += `&libraries=${this.libraries.join(",")}`),
              this.language && (url += `&language=${this.language}`),
              this.region && (url += `&region=${this.region}`),
              this.version && (url += `&v=${this.version}`),
              this.mapIds && (url += `&map_ids=${this.mapIds.join(",")}`),
              this.authReferrerPolicy &&
                (url += `&auth_referrer_policy=${this.authReferrerPolicy}`),
              url
            );
          }
          deleteScript() {
            const script = document.getElementById(this.id);
            script && script.remove();
          }
          load() {
            return this.loadPromise();
          }
          loadPromise() {
            return new Promise((resolve, reject) => {
              this.loadCallback((err) => {
                err ? reject(err.error) : resolve(window.google);
              });
            });
          }
          importLibrary(name) {
            return this.execute(), google.maps.importLibrary(name);
          }
          loadCallback(fn) {
            this.callbacks.push(fn), this.execute();
          }
          setScript() {
            var _a, _b;
            if (document.getElementById(this.id)) {
              this.callback();
              return;
            }
            const params = {
              key: this.apiKey,
              channel: this.channel,
              client: this.client,
              libraries: this.libraries.length && this.libraries,
              v: this.version,
              mapIds: this.mapIds,
              language: this.language,
              region: this.region,
              authReferrerPolicy: this.authReferrerPolicy,
            };
            Object.keys(params).forEach(
              (key) => !params[key] && delete params[key]
            ),
              (!(
                (_b =
                  (_a = window?.google) === null || _a === void 0
                    ? void 0
                    : _a.maps) === null || _b === void 0
              ) &&
                _b.importLibrary) ||
                ((g) => {
                  let h,
                    a,
                    k,
                    p = "The Google Maps JavaScript API",
                    c = "google",
                    l = "importLibrary",
                    q = "__ib__",
                    m = document,
                    b = window;
                  b = b[c] || (b[c] = {});
                  const d = b.maps || (b.maps = {}),
                    r = new Set(),
                    e = new URLSearchParams(),
                    u = () =>
                      h ||
                      (h = new Promise((f, n) =>
                        __awaiter(this, void 0, void 0, function* () {
                          var _a2;
                          yield (a = m.createElement("script")),
                            (a.id = this.id),
                            e.set("libraries", [...r] + "");
                          for (k in g)
                            e.set(
                              k.replace(
                                /[A-Z]/g,
                                (t) => "_" + t[0].toLowerCase()
                              ),
                              g[k]
                            );
                          e.set("callback", c + ".maps." + q),
                            (a.src = this.url + "?" + e),
                            (d[q] = f),
                            (a.onerror = () =>
                              (h = n(Error(p + " could not load.")))),
                            (a.nonce =
                              this.nonce ||
                              ((_a2 = m.querySelector("script[nonce]")) ===
                                null || _a2 === void 0
                                ? void 0
                                : _a2.nonce) ||
                              ""),
                            m.head.append(a);
                        })
                      ));
                  d[l]
                    ? console.warn(p + " only loads once. Ignoring:", g)
                    : (d[l] = (f, ...n) =>
                        r.add(f) && u().then(() => d[l](f, ...n)));
                })(params);
            const libraryPromises = this.libraries.map((library) =>
              this.importLibrary(library)
            );
            libraryPromises.length ||
              libraryPromises.push(this.importLibrary("core")),
              Promise.all(libraryPromises).then(
                () => this.callback(),
                (error) => {
                  const event = new ErrorEvent("error", { error });
                  this.loadErrorCallback(event);
                }
              );
          }
          reset() {
            this.deleteScript(),
              (this.done = !1),
              (this.loading = !1),
              (this.errors = []),
              (this.onerrorEvent = null);
          }
          resetIfRetryingFailed() {
            this.failed && this.reset();
          }
          loadErrorCallback(e) {
            if ((this.errors.push(e), this.errors.length <= this.retries)) {
              const delay =
                this.errors.length * Math.pow(2, this.errors.length);
              console.error(
                `Failed to load Google Maps script, retrying in ${delay} ms.`
              ),
                setTimeout(() => {
                  this.deleteScript(), this.setScript();
                }, delay);
            } else (this.onerrorEvent = e), this.callback();
          }
          callback() {
            (this.done = !0),
              (this.loading = !1),
              this.callbacks.forEach((cb) => {
                cb(this.onerrorEvent);
              }),
              (this.callbacks = []);
          }
          execute() {
            if ((this.resetIfRetryingFailed(), this.done)) this.callback();
            else {
              if (
                window.google &&
                window.google.maps &&
                window.google.maps.version
              ) {
                console.warn(
                  "Google Maps already loaded outside @googlemaps/js-api-loader.This may result in undesirable behavior as options and script parameters may not match."
                ),
                  this.callback();
                return;
              }
              this.loading || ((this.loading = !0), this.setScript());
            }
          }
        }
      },
      9635: function (
        __unused_webpack_module,
        __webpack_exports__2,
        __webpack_require__2
      ) {
        "use strict";
        __webpack_require__2.r(__webpack_exports__2),
          __webpack_require__2.d(__webpack_exports__2, {
            default: function () {
              return ClassNames;
            },
          });
        const defaultOptions = {
          active: !0,
          breakpoints: {},
          selected: "is-selected",
          draggable: "is-draggable",
          dragging: "is-dragging",
        };
        function removeClass(node, className) {
          const cl = node.classList;
          className && cl.contains(className) && cl.remove(className);
        }
        function addClass(node, className) {
          const cl = node.classList;
          className && !cl.contains(className) && cl.add(className);
        }
        function ClassNames(userOptions = {}) {
          let options, emblaApi, root, slides;
          const selectedEvents = ["select", "pointerUp"],
            draggingEvents = ["pointerDown", "pointerUp"];
          function init(emblaApiInstance, optionsHandler) {
            emblaApi = emblaApiInstance;
            const { mergeOptions, optionsAtMedia } = optionsHandler,
              optionsBase = mergeOptions(
                defaultOptions,
                ClassNames.globalOptions
              ),
              allOptions = mergeOptions(optionsBase, userOptions);
            (options = optionsAtMedia(allOptions)),
              (root = emblaApi.rootNode()),
              (slides = emblaApi.slideNodes()),
              !!emblaApi.internalEngine().options.watchDrag &&
                addClass(root, options.draggable),
              options.dragging &&
                draggingEvents.forEach((evt) =>
                  emblaApi.on(evt, toggleDraggingClass)
                ),
              options.selected &&
                (selectedEvents.forEach((evt) =>
                  emblaApi.on(evt, toggleSelectedClass)
                ),
                toggleSelectedClass());
          }
          function destroy() {
            removeClass(root, options.draggable),
              draggingEvents.forEach((evt) =>
                emblaApi.off(evt, toggleDraggingClass)
              ),
              selectedEvents.forEach((evt) =>
                emblaApi.off(evt, toggleSelectedClass)
              ),
              slides.forEach((slide) => removeClass(slide, options.selected));
          }
          function toggleDraggingClass(_, evt) {
            evt === "pointerDown"
              ? addClass(root, options.dragging)
              : removeClass(root, options.dragging);
          }
          function toggleSelectedClass() {
            const inView = emblaApi.slidesInView(!0);
            emblaApi
              .slidesNotInView(!0)
              .forEach((index) => removeClass(slides[index], options.selected)),
              inView.forEach((index) =>
                addClass(slides[index], options.selected)
              );
          }
          return { name: "classNames", options: userOptions, init, destroy };
        }
        ClassNames.globalOptions = void 0;
      },
      9298: function (
        __unused_webpack_module,
        __webpack_exports__2,
        __webpack_require__2
      ) {
        "use strict";
        __webpack_require__2.r(__webpack_exports__2),
          __webpack_require__2.d(__webpack_exports__2, {
            WheelGesturesPlugin: function () {
              return WheelGesturesPlugin;
            },
          });
        function _extends() {
          return (
            (_extends =
              Object.assign ||
              function (target) {
                for (var i = 1; i < arguments.length; i++) {
                  var source = arguments[i];
                  for (var key in source)
                    Object.prototype.hasOwnProperty.call(source, key) &&
                      (target[key] = source[key]);
                }
                return target;
              }),
            _extends.apply(this, arguments)
          );
        }
        var DECAY = 0.996,
          projection = function (velocityPxMs, decay) {
            return (
              decay === void 0 && (decay = DECAY),
              (velocityPxMs * decay) / (1 - decay)
            );
          };
        function lastOf(array) {
          return array[array.length - 1];
        }
        function average(numbers) {
          return (
            numbers.reduce(function (a, b) {
              return a + b;
            }) / numbers.length
          );
        }
        var clamp = function (value, min, max) {
          return Math.min(Math.max(min, value), max);
        };
        function addVectors(v1, v2) {
          if (v1.length !== v2.length)
            throw new Error("vectors must be same length");
          return v1.map(function (val, i) {
            return val + v2[i];
          });
        }
        function absMax(numbers) {
          return Math.max.apply(Math, numbers.map(Math.abs));
        }
        function deepFreeze(o) {
          return (
            Object.freeze(o),
            Object.values(o).forEach(function (value) {
              value !== null &&
                typeof value == "object" &&
                !Object.isFrozen(value) &&
                deepFreeze(value);
            }),
            o
          );
        }
        function EventBus() {
          var listeners = {};
          function on(type, listener) {
            return (
              (listeners[type] = (listeners[type] || []).concat(listener)),
              function () {
                return off(type, listener);
              }
            );
          }
          function off(type, listener) {
            listeners[type] = (listeners[type] || []).filter(function (l) {
              return l !== listener;
            });
          }
          function dispatch(type, data) {
            type in listeners &&
              listeners[type].forEach(function (l) {
                return l(data);
              });
          }
          return deepFreeze({ on, off, dispatch });
        }
        function WheelTargetObserver(eventListener) {
          var targets = [],
            observe = function (target) {
              return (
                target.addEventListener("wheel", eventListener, {
                  passive: !1,
                }),
                targets.push(target),
                function () {
                  return unobserve(target);
                }
              );
            },
            unobserve = function (target) {
              target.removeEventListener("wheel", eventListener),
                (targets = targets.filter(function (t) {
                  return t !== target;
                }));
            },
            disconnect = function () {
              targets.forEach(unobserve);
            };
          return deepFreeze({ observe, unobserve, disconnect });
        }
        var LINE_HEIGHT = 16 * 1.125,
          PAGE_HEIGHT = (typeof window < "u" && window.innerHeight) || 800,
          DELTA_MODE_UNIT = [1, LINE_HEIGHT, PAGE_HEIGHT];
        function normalizeWheel(e) {
          var deltaX = e.deltaX * DELTA_MODE_UNIT[e.deltaMode],
            deltaY = e.deltaY * DELTA_MODE_UNIT[e.deltaMode],
            deltaZ = (e.deltaZ || 0) * DELTA_MODE_UNIT[e.deltaMode];
          return {
            timeStamp: e.timeStamp,
            axisDelta: [deltaX, deltaY, deltaZ],
          };
        }
        var reverseAll = [-1, -1, -1];
        function reverseAxisDeltaSign(wheel, reverseSign) {
          if (!reverseSign) return wheel;
          var multipliers =
            reverseSign === !0
              ? reverseAll
              : reverseSign.map(function (shouldReverse) {
                  return shouldReverse ? -1 : 1;
                });
          return _extends({}, wheel, {
            axisDelta: wheel.axisDelta.map(function (delta, i) {
              return delta * multipliers[i];
            }),
          });
        }
        var DELTA_MAX_ABS = 700,
          clampAxisDelta = function (wheel) {
            return _extends({}, wheel, {
              axisDelta: wheel.axisDelta.map(function (delta) {
                return clamp(delta, -DELTA_MAX_ABS, DELTA_MAX_ABS);
              }),
            });
          },
          __DEV__ = !1,
          ACC_FACTOR_MIN = 0.6,
          ACC_FACTOR_MAX = 0.96,
          WHEELEVENTS_TO_MERGE = 2,
          WHEELEVENTS_TO_ANALAZE = 5,
          configDefaults = deepFreeze({
            preventWheelAction: !0,
            reverseSign: [!0, !0, !1],
          }),
          WILL_END_TIMEOUT_DEFAULT = 400;
        function createWheelGesturesState() {
          return {
            isStarted: !1,
            isStartPublished: !1,
            isMomentum: !1,
            startTime: 0,
            lastAbsDelta: 1 / 0,
            axisMovement: [0, 0, 0],
            axisVelocity: [0, 0, 0],
            accelerationFactors: [],
            scrollPoints: [],
            scrollPointsToMerge: [],
            willEndTimeout: WILL_END_TIMEOUT_DEFAULT,
          };
        }
        function WheelGestures(optionsParam) {
          optionsParam === void 0 && (optionsParam = {});
          var _EventBus = EventBus(),
            on = _EventBus.on,
            off = _EventBus.off,
            dispatch = _EventBus.dispatch,
            config = configDefaults,
            state = createWheelGesturesState(),
            currentEvent,
            negativeZeroFingerUpSpecialEvent = !1,
            prevWheelEventState,
            feedWheel = function (wheelEvents) {
              Array.isArray(wheelEvents)
                ? wheelEvents.forEach(function (wheelEvent) {
                    return processWheelEventData(wheelEvent);
                  })
                : processWheelEventData(wheelEvents);
            },
            updateOptions = function (newOptions) {
              return (
                newOptions === void 0 && (newOptions = {}),
                Object.values(newOptions).some(function (option) {
                  return option == null;
                })
                  ? (__DEV__ &&
                      console.error(
                        "updateOptions ignored! undefined & null options not allowed"
                      ),
                    config)
                  : (config = deepFreeze(
                      _extends({}, configDefaults, config, newOptions)
                    ))
              );
            },
            publishWheel = function (additionalData) {
              var wheelEventState = _extends(
                {
                  event: currentEvent,
                  isStart: !1,
                  isEnding: !1,
                  isMomentumCancel: !1,
                  isMomentum: state.isMomentum,
                  axisDelta: [0, 0, 0],
                  axisVelocity: state.axisVelocity,
                  axisMovement: state.axisMovement,
                  get axisMovementProjection() {
                    return addVectors(
                      wheelEventState.axisMovement,
                      wheelEventState.axisVelocity.map(function (velocity) {
                        return projection(velocity);
                      })
                    );
                  },
                },
                additionalData
              );
              dispatch(
                "wheel",
                _extends({}, wheelEventState, { previous: prevWheelEventState })
              ),
                (prevWheelEventState = wheelEventState);
            },
            shouldPreventDefault = function (deltaMaxAbs, axisDelta) {
              var _config = config,
                preventWheelAction = _config.preventWheelAction,
                deltaX = axisDelta[0],
                deltaY = axisDelta[1],
                deltaZ = axisDelta[2];
              if (typeof preventWheelAction == "boolean")
                return preventWheelAction;
              switch (preventWheelAction) {
                case "x":
                  return Math.abs(deltaX) >= deltaMaxAbs;
                case "y":
                  return Math.abs(deltaY) >= deltaMaxAbs;
                case "z":
                  return Math.abs(deltaZ) >= deltaMaxAbs;
                default:
                  return (
                    __DEV__ &&
                      console.warn(
                        "unsupported preventWheelAction value: " +
                          preventWheelAction,
                        "warn"
                      ),
                    !1
                  );
              }
            },
            processWheelEventData = function (wheelEvent) {
              var _clampAxisDelta = clampAxisDelta(
                  reverseAxisDeltaSign(
                    normalizeWheel(wheelEvent),
                    config.reverseSign
                  )
                ),
                axisDelta = _clampAxisDelta.axisDelta,
                timeStamp = _clampAxisDelta.timeStamp,
                deltaMaxAbs = absMax(axisDelta);
              if (
                (wheelEvent.preventDefault &&
                  shouldPreventDefault(deltaMaxAbs, axisDelta) &&
                  wheelEvent.preventDefault(),
                state.isStarted
                  ? state.isMomentum &&
                    deltaMaxAbs > Math.max(2, state.lastAbsDelta * 2) &&
                    (end(!0), start())
                  : start(),
                deltaMaxAbs === 0 &&
                  Object.is &&
                  Object.is(wheelEvent.deltaX, -0))
              ) {
                negativeZeroFingerUpSpecialEvent = !0;
                return;
              }
              (currentEvent = wheelEvent),
                (state.axisMovement = addVectors(
                  state.axisMovement,
                  axisDelta
                )),
                (state.lastAbsDelta = deltaMaxAbs),
                state.scrollPointsToMerge.push({ axisDelta, timeStamp }),
                mergeScrollPointsCalcVelocity(),
                publishWheel({ axisDelta, isStart: !state.isStartPublished }),
                (state.isStartPublished = !0),
                willEnd();
            },
            mergeScrollPointsCalcVelocity = function () {
              state.scrollPointsToMerge.length === WHEELEVENTS_TO_MERGE
                ? (state.scrollPoints.unshift({
                    axisDeltaSum: state.scrollPointsToMerge
                      .map(function (b) {
                        return b.axisDelta;
                      })
                      .reduce(addVectors),
                    timeStamp: average(
                      state.scrollPointsToMerge.map(function (b) {
                        return b.timeStamp;
                      })
                    ),
                  }),
                  updateVelocity(),
                  (state.scrollPointsToMerge.length = 0),
                  (state.scrollPoints.length = 1),
                  state.isMomentum || detectMomentum())
                : state.isStartPublished || updateStartVelocity();
            },
            updateStartVelocity = function () {
              state.axisVelocity = lastOf(
                state.scrollPointsToMerge
              ).axisDelta.map(function (d) {
                return d / state.willEndTimeout;
              });
            },
            updateVelocity = function () {
              var _state$scrollPoints = state.scrollPoints,
                latestScrollPoint = _state$scrollPoints[0],
                prevScrollPoint = _state$scrollPoints[1];
              if (!(!prevScrollPoint || !latestScrollPoint)) {
                var deltaTime =
                  latestScrollPoint.timeStamp - prevScrollPoint.timeStamp;
                if (deltaTime <= 0) {
                  __DEV__ && console.warn("invalid deltaTime");
                  return;
                }
                var velocity = latestScrollPoint.axisDeltaSum.map(function (d) {
                    return d / deltaTime;
                  }),
                  accelerationFactor = velocity.map(function (v, i) {
                    return v / (state.axisVelocity[i] || 1);
                  });
                (state.axisVelocity = velocity),
                  state.accelerationFactors.push(accelerationFactor),
                  updateWillEndTimeout(deltaTime);
              }
            },
            updateWillEndTimeout = function (deltaTime) {
              var newTimeout = Math.ceil(deltaTime / 10) * 10 * 1.2;
              state.isMomentum || (newTimeout = Math.max(100, newTimeout * 2)),
                (state.willEndTimeout = Math.min(1e3, Math.round(newTimeout)));
            },
            accelerationFactorInMomentumRange = function (accFactor) {
              return accFactor === 0
                ? !0
                : accFactor <= ACC_FACTOR_MAX && accFactor >= ACC_FACTOR_MIN;
            },
            detectMomentum = function () {
              if (state.accelerationFactors.length >= WHEELEVENTS_TO_ANALAZE) {
                if (
                  negativeZeroFingerUpSpecialEvent &&
                  ((negativeZeroFingerUpSpecialEvent = !1),
                  absMax(state.axisVelocity) >= 0.2)
                ) {
                  recognizedMomentum();
                  return;
                }
                var recentAccelerationFactors = state.accelerationFactors.slice(
                    WHEELEVENTS_TO_ANALAZE * -1
                  ),
                  detectedMomentum = recentAccelerationFactors.every(function (
                    accFac
                  ) {
                    var sameAccFac = !!accFac.reduce(function (f1, f2) {
                        return f1 && f1 < 1 && f1 === f2 ? 1 : 0;
                      }),
                      bothAreInRangeOrZero =
                        accFac.filter(accelerationFactorInMomentumRange)
                          .length === accFac.length;
                    return sameAccFac || bothAreInRangeOrZero;
                  });
                detectedMomentum && recognizedMomentum(),
                  (state.accelerationFactors = recentAccelerationFactors);
              }
            },
            recognizedMomentum = function () {
              state.isMomentum = !0;
            },
            start = function () {
              (state = createWheelGesturesState()),
                (state.isStarted = !0),
                (state.startTime = Date.now()),
                (prevWheelEventState = void 0),
                (negativeZeroFingerUpSpecialEvent = !1);
            },
            willEnd = (function () {
              var willEndId;
              return function () {
                clearTimeout(willEndId),
                  (willEndId = setTimeout(end, state.willEndTimeout));
              };
            })(),
            end = function (isMomentumCancel) {
              isMomentumCancel === void 0 && (isMomentumCancel = !1),
                state.isStarted &&
                  (state.isMomentum && isMomentumCancel
                    ? publishWheel({ isEnding: !0, isMomentumCancel: !0 })
                    : publishWheel({ isEnding: !0 }),
                  (state.isMomentum = !1),
                  (state.isStarted = !1));
            },
            _WheelTargetObserver = WheelTargetObserver(feedWheel),
            observe = _WheelTargetObserver.observe,
            unobserve = _WheelTargetObserver.unobserve,
            disconnect = _WheelTargetObserver.disconnect;
          return (
            updateOptions(optionsParam),
            deepFreeze({
              on,
              off,
              observe,
              unobserve,
              disconnect,
              feedWheel,
              updateOptions,
            })
          );
        }
        var wheel_gestures_esm = WheelGestures,
          defaultOptions = {
            active: !0,
            breakpoints: {},
            wheelDraggingClass: "is-wheel-dragging",
            forceWheelAxis: void 0,
            target: void 0,
          };
        WheelGesturesPlugin.globalOptions = void 0;
        var embla_carousel_wheel_gestures_esm_DEV_ = !1;
        function WheelGesturesPlugin(userOptions) {
          userOptions === void 0 && (userOptions = {});
          var options,
            cleanup = function () {};
          function init(embla, optionsHandler) {
            var _options$target,
              _options$forceWheelAx,
              mergeOptions = optionsHandler.mergeOptions,
              optionsAtMedia = optionsHandler.optionsAtMedia,
              optionsBase = mergeOptions(
                defaultOptions,
                WheelGesturesPlugin.globalOptions
              ),
              allOptions = mergeOptions(optionsBase, userOptions);
            options = optionsAtMedia(allOptions);
            var engine = embla.internalEngine(),
              targetNode =
                (_options$target = options.target) != null
                  ? _options$target
                  : embla.containerNode().parentNode,
              wheelAxis =
                (_options$forceWheelAx = options.forceWheelAxis) != null
                  ? _options$forceWheelAx
                  : engine.options.axis,
              wheelGestures = wheel_gestures_esm({
                preventWheelAction: wheelAxis,
                reverseSign: [!0, !0, !1],
              }),
              unobserveTargetNode = wheelGestures.observe(targetNode),
              offWheel = wheelGestures.on("wheel", handleWheel),
              isStarted = !1,
              startEvent;
            function wheelGestureStarted(state) {
              try {
                (startEvent = new MouseEvent("mousedown", state.event)),
                  dispatchEvent(startEvent);
              } catch {
                return (
                  embla_carousel_wheel_gestures_esm_DEV_ &&
                    console.warn(
                      "Legacy browser requires events-polyfill (https://github.com/xiel/embla-carousel-wheel-gestures#legacy-browsers)"
                    ),
                  cleanup()
                );
              }
              (isStarted = !0),
                addNativeMouseEventListeners(),
                options.wheelDraggingClass &&
                  targetNode.classList.add(options.wheelDraggingClass);
            }
            function wheelGestureEnded(state) {
              (isStarted = !1),
                dispatchEvent(createRelativeMouseEvent("mouseup", state)),
                removeNativeMouseEventListeners(),
                options.wheelDraggingClass &&
                  targetNode.classList.remove(options.wheelDraggingClass);
            }
            function addNativeMouseEventListeners() {
              document.documentElement.addEventListener(
                "mousemove",
                preventNativeMouseHandler,
                !0
              ),
                document.documentElement.addEventListener(
                  "mouseup",
                  preventNativeMouseHandler,
                  !0
                ),
                document.documentElement.addEventListener(
                  "mousedown",
                  preventNativeMouseHandler,
                  !0
                );
            }
            function removeNativeMouseEventListeners() {
              document.documentElement.removeEventListener(
                "mousemove",
                preventNativeMouseHandler,
                !0
              ),
                document.documentElement.removeEventListener(
                  "mouseup",
                  preventNativeMouseHandler,
                  !0
                ),
                document.documentElement.removeEventListener(
                  "mousedown",
                  preventNativeMouseHandler,
                  !0
                );
            }
            function preventNativeMouseHandler(e) {
              isStarted && e.isTrusted && e.stopImmediatePropagation();
            }
            function createRelativeMouseEvent(type, state) {
              var moveX, moveY;
              if (wheelAxis === engine.options.axis) {
                var _state$axisMovement = state.axisMovement;
                (moveX = _state$axisMovement[0]),
                  (moveY = _state$axisMovement[1]);
              } else {
                var _state$axisMovement2 = state.axisMovement;
                (moveY = _state$axisMovement2[0]),
                  (moveX = _state$axisMovement2[1]);
              }
              return new MouseEvent(type, {
                clientX: startEvent.clientX + moveX,
                clientY: startEvent.clientY + moveY,
                screenX: startEvent.screenX + moveX,
                screenY: startEvent.screenY + moveY,
                movementX: moveX,
                movementY: moveY,
                button: 0,
                bubbles: !0,
                cancelable: !0,
                composed: !0,
              });
            }
            function dispatchEvent(event) {
              embla.containerNode().dispatchEvent(event);
            }
            function handleWheel(state) {
              var _state$axisDelta = state.axisDelta,
                deltaX = _state$axisDelta[0],
                deltaY = _state$axisDelta[1],
                primaryAxisDelta = wheelAxis === "x" ? deltaX : deltaY,
                crossAxisDelta = wheelAxis === "x" ? deltaY : deltaX,
                isRelease =
                  state.isMomentum &&
                  state.previous &&
                  !state.previous.isMomentum,
                isEndingOrRelease =
                  (state.isEnding && !state.isMomentum) || isRelease,
                primaryAxisDeltaIsDominant =
                  Math.abs(primaryAxisDelta) > Math.abs(crossAxisDelta);
              primaryAxisDeltaIsDominant &&
                !isStarted &&
                !state.isMomentum &&
                wheelGestureStarted(state),
                isStarted &&
                  (isEndingOrRelease
                    ? wheelGestureEnded(state)
                    : dispatchEvent(
                        createRelativeMouseEvent("mousemove", state)
                      ));
            }
            cleanup = function () {
              unobserveTargetNode(),
                offWheel(),
                removeNativeMouseEventListeners();
            };
          }
          var self = {
            name: "wheelGestures",
            options: userOptions,
            init,
            destroy: function () {
              return cleanup();
            },
          };
          return self;
        }
      },
      1689: function (
        __unused_webpack_module,
        __webpack_exports__2,
        __webpack_require__2
      ) {
        "use strict";
        __webpack_require__2.r(__webpack_exports__2),
          __webpack_require__2.d(__webpack_exports__2, {
            default: function () {
              return EmblaCarousel;
            },
          });
        function isNumber(subject) {
          return typeof subject == "number";
        }
        function isString(subject) {
          return typeof subject == "string";
        }
        function isBoolean(subject) {
          return typeof subject == "boolean";
        }
        function isObject(subject) {
          return Object.prototype.toString.call(subject) === "[object Object]";
        }
        function mathAbs(n) {
          return Math.abs(n);
        }
        function mathSign(n) {
          return Math.sign(n);
        }
        function deltaAbs(valueB, valueA) {
          return mathAbs(valueB - valueA);
        }
        function factorAbs(valueB, valueA) {
          if (
            valueB === 0 ||
            valueA === 0 ||
            mathAbs(valueB) <= mathAbs(valueA)
          )
            return 0;
          const diff = deltaAbs(mathAbs(valueB), mathAbs(valueA));
          return mathAbs(diff / valueB);
        }
        function arrayKeys(array) {
          return objectKeys(array).map(Number);
        }
        function arrayLast(array) {
          return array[arrayLastIndex(array)];
        }
        function arrayLastIndex(array) {
          return Math.max(0, array.length - 1);
        }
        function objectKeys(object) {
          return Object.keys(object);
        }
        function objectsMergeDeep(objectA, objectB) {
          return [objectA, objectB].reduce(
            (mergedObjects, currentObject) => (
              objectKeys(currentObject).forEach((key) => {
                const valueA = mergedObjects[key],
                  valueB = currentObject[key],
                  areObjects = isObject(valueA) && isObject(valueB);
                mergedObjects[key] = areObjects
                  ? objectsMergeDeep(valueA, valueB)
                  : valueB;
              }),
              mergedObjects
            ),
            {}
          );
        }
        function isMouseEvent(evt, ownerWindow) {
          return (
            typeof ownerWindow.MouseEvent < "u" &&
            evt instanceof ownerWindow.MouseEvent
          );
        }
        function Alignment(align, viewSize) {
          const predefined = { start, center, end };
          function start() {
            return 0;
          }
          function center(n) {
            return end(n) / 2;
          }
          function end(n) {
            return viewSize - n;
          }
          function percent() {
            return viewSize * Number(align);
          }
          function measure(n) {
            return isNumber(align) ? percent() : predefined[align](n);
          }
          return { measure };
        }
        function Axis(axis, direction) {
          const scroll = axis === "y" ? "y" : "x",
            cross = axis === "y" ? "x" : "y",
            startEdge = getStartEdge(),
            endEdge = getEndEdge();
          function measureSize(rect) {
            const { width, height } = rect;
            return scroll === "x" ? width : height;
          }
          function getStartEdge() {
            return scroll === "y"
              ? "top"
              : direction === "rtl"
              ? "right"
              : "left";
          }
          function getEndEdge() {
            return scroll === "y"
              ? "bottom"
              : direction === "rtl"
              ? "left"
              : "right";
          }
          return { scroll, cross, startEdge, endEdge, measureSize };
        }
        function Limit(min, max) {
          const length = mathAbs(min - max);
          function reachedMin(n) {
            return n < min;
          }
          function reachedMax(n) {
            return n > max;
          }
          function reachedAny(n) {
            return reachedMin(n) || reachedMax(n);
          }
          function constrain(n) {
            return reachedAny(n) ? (reachedMin(n) ? min : max) : n;
          }
          function removeOffset(n) {
            return length ? n - length * Math.ceil((n - max) / length) : n;
          }
          return {
            length,
            max,
            min,
            constrain,
            reachedAny,
            reachedMax,
            reachedMin,
            removeOffset,
          };
        }
        function Counter(max, start, loop) {
          const { constrain } = Limit(0, max),
            loopEnd = max + 1;
          let counter = withinLimit(start);
          function withinLimit(n) {
            return loop ? mathAbs((loopEnd + n) % loopEnd) : constrain(n);
          }
          function get() {
            return counter;
          }
          function set(n) {
            return (counter = withinLimit(n)), self;
          }
          function add(n) {
            return clone().set(get() + n);
          }
          function clone() {
            return Counter(max, get(), loop);
          }
          const self = { get, set, add, clone };
          return self;
        }
        function Direction(direction) {
          const sign = direction === "rtl" ? -1 : 1;
          function apply(n) {
            return n * sign;
          }
          return { apply };
        }
        function EventStore() {
          let listeners = [];
          function add(node, type, handler, options = { passive: !0 }) {
            return (
              node.addEventListener(type, handler, options),
              listeners.push(() =>
                node.removeEventListener(type, handler, options)
              ),
              self
            );
          }
          function clear() {
            listeners = listeners.filter((remove) => remove());
          }
          const self = { add, clear };
          return self;
        }
        function DragHandler(
          axis,
          direction,
          rootNode,
          ownerDocument,
          ownerWindow,
          target,
          dragTracker,
          location,
          animation,
          scrollTo,
          scrollBody,
          scrollTarget,
          index,
          eventHandler,
          percentOfView,
          dragFree,
          dragThreshold,
          skipSnaps,
          baseFriction
        ) {
          const { cross: crossAxis } = axis,
            focusNodes = ["INPUT", "SELECT", "TEXTAREA"],
            nonPassiveEvent = { passive: !1 },
            initEvents = EventStore(),
            dragEvents = EventStore(),
            goToNextThreshold = Limit(50, 225).constrain(
              percentOfView.measure(20)
            ),
            snapForceBoost = { mouse: 300, touch: 400 },
            freeForceBoost = { mouse: 500, touch: 600 },
            baseSpeed = dragFree ? 43 : 25;
          let isMoving = !1,
            startScroll = 0,
            startCross = 0,
            pointerIsDown = !1,
            preventScroll = !1,
            preventClick = !1,
            isMouse = !1;
          function init(emblaApi, watchDrag) {
            if (!watchDrag) return;
            function downIfAllowed(evt) {
              (isBoolean(watchDrag) || watchDrag(emblaApi, evt)) && down(evt);
            }
            const node = rootNode;
            initEvents
              .add(
                node,
                "dragstart",
                (evt) => evt.preventDefault(),
                nonPassiveEvent
              )
              .add(node, "touchmove", () => {}, nonPassiveEvent)
              .add(node, "touchend", () => {})
              .add(node, "touchstart", downIfAllowed)
              .add(node, "mousedown", downIfAllowed)
              .add(node, "touchcancel", up)
              .add(node, "contextmenu", up)
              .add(node, "click", click, !0);
          }
          function destroy() {
            initEvents.clear(), dragEvents.clear();
          }
          function addDragEvents() {
            const node = isMouse ? ownerDocument : rootNode;
            dragEvents
              .add(node, "touchmove", move, nonPassiveEvent)
              .add(node, "touchend", up)
              .add(node, "mousemove", move, nonPassiveEvent)
              .add(node, "mouseup", up);
          }
          function isFocusNode(node) {
            const nodeName = node.nodeName || "";
            return focusNodes.includes(nodeName);
          }
          function forceBoost() {
            return (dragFree ? freeForceBoost : snapForceBoost)[
              isMouse ? "mouse" : "touch"
            ];
          }
          function allowedForce(force, targetChanged) {
            const next = index.add(mathSign(force) * -1),
              baseForce = scrollTarget.byDistance(force, !dragFree).distance;
            return dragFree || mathAbs(force) < goToNextThreshold
              ? baseForce
              : skipSnaps && targetChanged
              ? baseForce * 0.5
              : scrollTarget.byIndex(next.get(), 0).distance;
          }
          function down(evt) {
            const isMouseEvt = isMouseEvent(evt, ownerWindow);
            (isMouse = isMouseEvt),
              !(isMouseEvt && evt.button !== 0) &&
                (isFocusNode(evt.target) ||
                  ((preventClick =
                    dragFree && isMouseEvt && !evt.buttons && isMoving),
                  (isMoving = deltaAbs(target.get(), location.get()) >= 2),
                  (pointerIsDown = !0),
                  dragTracker.pointerDown(evt),
                  scrollBody.useFriction(0).useDuration(0),
                  target.set(location),
                  addDragEvents(),
                  (startScroll = dragTracker.readPoint(evt)),
                  (startCross = dragTracker.readPoint(evt, crossAxis)),
                  eventHandler.emit("pointerDown")));
          }
          function move(evt) {
            const lastScroll = dragTracker.readPoint(evt),
              lastCross = dragTracker.readPoint(evt, crossAxis),
              diffScroll = deltaAbs(lastScroll, startScroll),
              diffCross = deltaAbs(lastCross, startCross);
            if (
              !preventScroll &&
              !isMouse &&
              (!evt.cancelable ||
                ((preventScroll = diffScroll > diffCross), !preventScroll))
            )
              return up(evt);
            const diff = dragTracker.pointerMove(evt);
            diffScroll > dragThreshold && (preventClick = !0),
              scrollBody.useFriction(0.3).useDuration(1),
              animation.start(),
              target.add(direction.apply(diff)),
              evt.preventDefault();
          }
          function up(evt) {
            const targetChanged =
                scrollTarget.byDistance(0, !1).index !== index.get(),
              rawForce = dragTracker.pointerUp(evt) * forceBoost(),
              force = allowedForce(direction.apply(rawForce), targetChanged),
              forceFactor = factorAbs(rawForce, force),
              speed = baseSpeed - 10 * forceFactor,
              friction = baseFriction + forceFactor / 50;
            (preventScroll = !1),
              (pointerIsDown = !1),
              dragEvents.clear(),
              scrollBody.useDuration(speed).useFriction(friction),
              scrollTo.distance(force, !dragFree),
              (isMouse = !1),
              eventHandler.emit("pointerUp");
          }
          function click(evt) {
            preventClick && (evt.stopPropagation(), evt.preventDefault());
          }
          function pointerDown() {
            return pointerIsDown;
          }
          return { init, pointerDown, destroy };
        }
        function DragTracker(axis, ownerWindow) {
          let startEvent, lastEvent;
          function readTime(evt) {
            return evt.timeStamp;
          }
          function readPoint(evt, evtAxis) {
            const coord = `client${
              (evtAxis || axis.scroll) === "x" ? "X" : "Y"
            }`;
            return (isMouseEvent(evt, ownerWindow) ? evt : evt.touches[0])[
              coord
            ];
          }
          function pointerDown(evt) {
            return (startEvent = evt), (lastEvent = evt), readPoint(evt);
          }
          function pointerMove(evt) {
            const diff = readPoint(evt) - readPoint(lastEvent),
              expired = readTime(evt) - readTime(startEvent) > 170;
            return (lastEvent = evt), expired && (startEvent = evt), diff;
          }
          function pointerUp(evt) {
            if (!startEvent || !lastEvent) return 0;
            const diffDrag = readPoint(lastEvent) - readPoint(startEvent),
              diffTime = readTime(evt) - readTime(startEvent),
              expired = readTime(evt) - readTime(lastEvent) > 170,
              force = diffDrag / diffTime;
            return diffTime && !expired && mathAbs(force) > 0.1 ? force : 0;
          }
          return { pointerDown, pointerMove, pointerUp, readPoint };
        }
        function PercentOfView(viewSize) {
          function measure(n) {
            return viewSize * (n / 100);
          }
          return { measure };
        }
        function ResizeHandler(
          container,
          eventHandler,
          ownerWindow,
          slides,
          axis
        ) {
          let resizeObserver,
            containerSize,
            slideSizes = [],
            destroyed = !1;
          function readSize(node) {
            return axis.measureSize(node.getBoundingClientRect());
          }
          function init(emblaApi, watchResize) {
            if (!watchResize) return;
            (containerSize = readSize(container)),
              (slideSizes = slides.map(readSize));
            function defaultCallback(entries) {
              for (const entry of entries) {
                const isContainer = entry.target === container,
                  slideIndex = slides.indexOf(entry.target),
                  lastSize = isContainer
                    ? containerSize
                    : slideSizes[slideIndex],
                  newSize = readSize(
                    isContainer ? container : slides[slideIndex]
                  );
                if (lastSize !== newSize) {
                  ownerWindow.requestAnimationFrame(() => {
                    emblaApi.reInit(), eventHandler.emit("resize");
                  });
                  break;
                }
              }
            }
            (resizeObserver = new ResizeObserver((entries) => {
              destroyed ||
                ((isBoolean(watchResize) || watchResize(emblaApi, entries)) &&
                  defaultCallback(entries));
            })),
              [container]
                .concat(slides)
                .forEach((node) => resizeObserver.observe(node));
          }
          function destroy() {
            resizeObserver && resizeObserver.disconnect(), (destroyed = !0);
          }
          return { init, destroy };
        }
        function ScrollBody(location, target, baseDuration, baseFriction) {
          let hasSettled = !0,
            bodyVelocity = 0,
            scrollDirection = 0,
            scrollDuration = baseDuration,
            scrollFriction = baseFriction,
            rawLocation = location.get(),
            rawLocationPrevious = 0;
          function seek() {
            const diff = target.get() - location.get(),
              isInstant = !scrollDuration;
            let directionDiff = 0;
            return (
              isInstant
                ? ((bodyVelocity = 0),
                  location.set(target),
                  (directionDiff = diff))
                : ((bodyVelocity += diff / scrollDuration),
                  (bodyVelocity *= scrollFriction),
                  (rawLocation += bodyVelocity),
                  location.add(bodyVelocity),
                  (directionDiff = rawLocation - rawLocationPrevious)),
              (scrollDirection = mathSign(directionDiff)),
              (rawLocationPrevious = rawLocation),
              (hasSettled = mathAbs(diff) < 0.001),
              self
            );
          }
          function settled() {
            return hasSettled;
          }
          function duration() {
            return scrollDuration;
          }
          function direction() {
            return scrollDirection;
          }
          function velocity() {
            return bodyVelocity;
          }
          function useBaseDuration() {
            return useDuration(baseDuration);
          }
          function useBaseFriction() {
            return useFriction(baseFriction);
          }
          function useDuration(n) {
            return (scrollDuration = n), self;
          }
          function useFriction(n) {
            return (scrollFriction = n), self;
          }
          const self = {
            direction,
            duration,
            velocity,
            seek,
            settled,
            useBaseFriction,
            useBaseDuration,
            useFriction,
            useDuration,
          };
          return self;
        }
        function ScrollBounds(
          limit,
          location,
          target,
          scrollBody,
          percentOfView
        ) {
          const pullBackThreshold = percentOfView.measure(10),
            edgeOffsetTolerance = percentOfView.measure(50),
            frictionLimit = Limit(0.1, 0.99);
          let disabled = !1;
          function shouldConstrain() {
            return !(
              disabled ||
              !limit.reachedAny(target.get()) ||
              !limit.reachedAny(location.get())
            );
          }
          function constrain(pointerDown) {
            if (!shouldConstrain()) return;
            const edge = limit.reachedMin(location.get()) ? "min" : "max",
              diffToEdge = mathAbs(limit[edge] - location.get()),
              diffToTarget = target.get() - location.get(),
              friction = frictionLimit.constrain(
                diffToEdge / edgeOffsetTolerance
              );
            target.subtract(diffToTarget * friction),
              !pointerDown &&
                mathAbs(diffToTarget) < pullBackThreshold &&
                (target.set(limit.constrain(target.get())),
                scrollBody.useDuration(25).useBaseFriction());
          }
          function toggleActive(active) {
            disabled = !active;
          }
          return { constrain, toggleActive };
        }
        function ScrollContain(
          viewSize,
          contentSize,
          snapsAligned,
          containScroll
        ) {
          const scrollBounds = Limit(-contentSize + viewSize, snapsAligned[0]),
            snapsBounded = measureBounded(),
            snapsContained = measureContained();
          function findDuplicates() {
            const startSnap = snapsBounded[0],
              endSnap = arrayLast(snapsBounded),
              min = snapsBounded.lastIndexOf(startSnap),
              max = snapsBounded.indexOf(endSnap) + 1;
            return Limit(min, max);
          }
          function measureBounded() {
            return snapsAligned
              .map(scrollBounds.constrain)
              .map((scrollBound) => parseFloat(scrollBound.toFixed(3)));
          }
          function measureContained() {
            if (contentSize <= viewSize) return [scrollBounds.max];
            if (containScroll === "keepSnaps") return snapsBounded;
            const { min, max } = findDuplicates();
            return snapsBounded.slice(min, max);
          }
          return { snapsContained };
        }
        function ScrollLimit(contentSize, scrollSnaps, loop) {
          const max = scrollSnaps[0],
            min = loop ? max - contentSize : arrayLast(scrollSnaps);
          return { limit: Limit(min, max) };
        }
        function ScrollLooper(contentSize, limit, offsetLocation, vectors) {
          const min = limit.min + 0.1,
            max = limit.max + 0.1,
            { reachedMin, reachedMax } = Limit(min, max);
          function shouldLoop(direction) {
            return direction === 1
              ? reachedMax(offsetLocation.get())
              : direction === -1
              ? reachedMin(offsetLocation.get())
              : !1;
          }
          function loop(direction) {
            if (!shouldLoop(direction)) return;
            const loopDistance = contentSize * (direction * -1);
            vectors.forEach((v) => v.add(loopDistance));
          }
          return { loop };
        }
        function ScrollProgress(limit) {
          const { max, length: scrollLength } = limit;
          function get(n) {
            return (n - max) / -scrollLength;
          }
          return { get };
        }
        function ScrollSnaps(
          axis,
          alignment,
          containerRect,
          slideRects,
          slideSizesWithGaps,
          slidesToScroll,
          containScroll
        ) {
          const { startEdge, endEdge } = axis,
            { groupSlides } = slidesToScroll,
            alignments = measureSizes().map(alignment.measure),
            snaps = measureUnaligned(),
            snapsAligned = measureAligned();
          function measureSizes() {
            return groupSlides(slideRects)
              .map((rects) => arrayLast(rects)[endEdge] - rects[0][startEdge])
              .map(mathAbs);
          }
          function measureUnaligned() {
            return slideRects
              .map((rect) => containerRect[startEdge] - rect[startEdge])
              .map((snap) => -mathAbs(snap));
          }
          function measureAligned() {
            const containedEndSnap =
              arrayLast(snaps) - arrayLast(slideSizesWithGaps);
            return groupSlides(snaps)
              .map((g) => g[0])
              .map((snap, index, groupedSnaps) => {
                const isFirst = !index,
                  isLast = index === arrayLastIndex(groupedSnaps);
                return containScroll && isFirst
                  ? 0
                  : containScroll && isLast
                  ? containedEndSnap
                  : snap + alignments[index];
              });
          }
          return { snaps, snapsAligned };
        }
        function ScrollTarget(
          loop,
          scrollSnaps,
          contentSize,
          limit,
          targetVector
        ) {
          const { reachedAny, removeOffset, constrain } = limit;
          function minDistance(distances) {
            return distances
              .concat()
              .sort((a, b) => mathAbs(a) - mathAbs(b))[0];
          }
          function findTargetSnap(target) {
            const distance = loop ? removeOffset(target) : constrain(target),
              ascDiffsToSnaps = scrollSnaps
                .map((scrollSnap) => scrollSnap - distance)
                .map((diffToSnap) => shortcut(diffToSnap, 0))
                .map((diff, i) => ({ diff, index: i }))
                .sort((d1, d2) => mathAbs(d1.diff) - mathAbs(d2.diff)),
              { index } = ascDiffsToSnaps[0];
            return { index, distance };
          }
          function shortcut(target, direction) {
            const targets = [
              target,
              target + contentSize,
              target - contentSize,
            ];
            if (!loop) return targets[0];
            if (!direction) return minDistance(targets);
            const matchingTargets = targets.filter(
              (t) => mathSign(t) === direction
            );
            return minDistance(matchingTargets);
          }
          function byIndex(index, direction) {
            const diffToSnap = scrollSnaps[index] - targetVector.get(),
              distance = shortcut(diffToSnap, direction);
            return { index, distance };
          }
          function byDistance(distance, snap) {
            const target = targetVector.get() + distance,
              { index, distance: targetSnapDistance } = findTargetSnap(target),
              reachedBound = !loop && reachedAny(target);
            if (!snap || reachedBound) return { index, distance };
            const diffToSnap = scrollSnaps[index] - targetSnapDistance,
              snapDistance = distance + shortcut(diffToSnap, 0);
            return { index, distance: snapDistance };
          }
          return { byDistance, byIndex, shortcut };
        }
        function ScrollTo(
          animation,
          indexCurrent,
          indexPrevious,
          scrollTarget,
          scrollBody,
          targetVector,
          eventHandler
        ) {
          function scrollTo(target) {
            const distanceDiff = target.distance,
              indexDiff = target.index !== indexCurrent.get();
            targetVector.add(distanceDiff),
              distanceDiff &&
                (scrollBody.duration()
                  ? animation.start()
                  : (animation.update(),
                    animation.render(1),
                    animation.update())),
              indexDiff &&
                (indexPrevious.set(indexCurrent.get()),
                indexCurrent.set(target.index),
                eventHandler.emit("select"));
          }
          function distance(n, snap) {
            const target = scrollTarget.byDistance(n, snap);
            scrollTo(target);
          }
          function index(n, direction) {
            const targetIndex = indexCurrent.clone().set(n),
              target = scrollTarget.byIndex(targetIndex.get(), direction);
            scrollTo(target);
          }
          return { distance, index };
        }
        function Vector1D(initialValue) {
          let value = initialValue;
          function get() {
            return value;
          }
          function set(n) {
            value = normalizeInput(n);
          }
          function add(n) {
            value += normalizeInput(n);
          }
          function subtract(n) {
            value -= normalizeInput(n);
          }
          function normalizeInput(n) {
            return isNumber(n) ? n : n.get();
          }
          return { get, set, add, subtract };
        }
        function Translate(axis, direction, container) {
          const translate = axis.scroll === "x" ? x : y,
            containerStyle = container.style;
          let disabled = !1;
          function x(n) {
            return `translate3d(${n}px,0px,0px)`;
          }
          function y(n) {
            return `translate3d(0px,${n}px,0px)`;
          }
          function to(target) {
            disabled ||
              (containerStyle.transform = translate(direction.apply(target)));
          }
          function toggleActive(active) {
            disabled = !active;
          }
          function clear() {
            disabled ||
              ((containerStyle.transform = ""),
              container.getAttribute("style") ||
                container.removeAttribute("style"));
          }
          return { clear, to, toggleActive };
        }
        function SlideLooper(
          axis,
          direction,
          viewSize,
          contentSize,
          slideSizesWithGaps,
          scrollSnaps,
          slidesInView,
          offsetLocation,
          slides
        ) {
          const ascItems = arrayKeys(slideSizesWithGaps),
            descItems = arrayKeys(slideSizesWithGaps).reverse(),
            loopPoints = startPoints().concat(endPoints());
          function removeSlideSizes(indexes, from) {
            return indexes.reduce((a, i) => a - slideSizesWithGaps[i], from);
          }
          function slidesInGap(indexes, gap) {
            return indexes.reduce(
              (a, i) => (removeSlideSizes(a, gap) > 0 ? a.concat([i]) : a),
              []
            );
          }
          function findLoopPoints(indexes, edge) {
            const isStartEdge = edge === "start",
              offset = isStartEdge ? -contentSize : contentSize,
              slideBounds = slidesInView.findSlideBounds([offset]);
            return indexes.map((index) => {
              const initial = isStartEdge ? 0 : -contentSize,
                altered = isStartEdge ? contentSize : 0,
                loopPoint = slideBounds.filter((b) => b.index === index)[0][
                  isStartEdge ? "end" : "start"
                ];
              return {
                index,
                slideLocation: Vector1D(-1),
                translate: Translate(axis, direction, slides[index]),
                target: () =>
                  offsetLocation.get() > loopPoint ? initial : altered,
              };
            });
          }
          function startPoints() {
            const gap = scrollSnaps[0] - 1,
              indexes = slidesInGap(descItems, gap);
            return findLoopPoints(indexes, "end");
          }
          function endPoints() {
            const gap = viewSize - scrollSnaps[0] - 1,
              indexes = slidesInGap(ascItems, gap);
            return findLoopPoints(indexes, "start");
          }
          function canLoop() {
            return loopPoints.every(({ index }) => {
              const otherIndexes = ascItems.filter((i) => i !== index);
              return removeSlideSizes(otherIndexes, viewSize) <= 0.1;
            });
          }
          function loop() {
            loopPoints.forEach((loopPoint) => {
              const { target, translate, slideLocation } = loopPoint,
                shiftLocation = target();
              shiftLocation !== slideLocation.get() &&
                (translate.to(shiftLocation), slideLocation.set(shiftLocation));
            });
          }
          function clear() {
            loopPoints.forEach((loopPoint) => loopPoint.translate.clear());
          }
          return { canLoop, clear, loop, loopPoints };
        }
        function SlidesHandler(container, eventHandler) {
          let mutationObserver,
            destroyed = !1;
          function init(emblaApi, watchSlides) {
            if (!watchSlides) return;
            function defaultCallback(mutations) {
              for (const mutation of mutations)
                if (mutation.type === "childList") {
                  emblaApi.reInit(), eventHandler.emit("slidesChanged");
                  break;
                }
            }
            (mutationObserver = new MutationObserver((mutations) => {
              destroyed ||
                ((isBoolean(watchSlides) || watchSlides(emblaApi, mutations)) &&
                  defaultCallback(mutations));
            })),
              mutationObserver.observe(container, { childList: !0 });
          }
          function destroy() {
            mutationObserver && mutationObserver.disconnect(), (destroyed = !0);
          }
          return { init, destroy };
        }
        function SlidesInView(
          viewSize,
          contentSize,
          slideSizes,
          snaps,
          limit,
          loop,
          inViewThreshold
        ) {
          const { removeOffset, constrain } = limit,
            roundingSafety = 0.5,
            cachedOffsets = loop ? [0, contentSize, -contentSize] : [0],
            cachedBounds = findSlideBounds(cachedOffsets, inViewThreshold);
          function findSlideThresholds(threshold) {
            const slideThreshold = threshold || 0;
            return slideSizes.map((slideSize) =>
              Limit(roundingSafety, slideSize - roundingSafety).constrain(
                slideSize * slideThreshold
              )
            );
          }
          function findSlideBounds(offsets, threshold) {
            const slideOffsets = offsets || cachedOffsets,
              slideThresholds = findSlideThresholds(threshold);
            return slideOffsets.reduce((list, offset) => {
              const bounds = snaps.map((snap, index) => ({
                start:
                  snap - slideSizes[index] + slideThresholds[index] + offset,
                end: snap + viewSize - slideThresholds[index] + offset,
                index,
              }));
              return list.concat(bounds);
            }, []);
          }
          function check(location, bounds) {
            const limitedLocation = loop
              ? removeOffset(location)
              : constrain(location);
            return (bounds || cachedBounds).reduce((list, slideBound) => {
              const { index, start, end } = slideBound,
                inList = list.includes(index),
                inView = start < limitedLocation && end > limitedLocation;
              return !inList && inView ? list.concat([index]) : list;
            }, []);
          }
          return { check, findSlideBounds };
        }
        function SlideSizes(
          axis,
          containerRect,
          slideRects,
          slides,
          readEdgeGap,
          ownerWindow
        ) {
          const { measureSize, startEdge, endEdge } = axis,
            withEdgeGap = slideRects[0] && readEdgeGap,
            startGap = measureStartGap(),
            endGap = measureEndGap(),
            slideSizes = slideRects.map(measureSize),
            slideSizesWithGaps = measureWithGaps();
          function measureStartGap() {
            if (!withEdgeGap) return 0;
            const slideRect = slideRects[0];
            return mathAbs(containerRect[startEdge] - slideRect[startEdge]);
          }
          function measureEndGap() {
            if (!withEdgeGap) return 0;
            const style = ownerWindow.getComputedStyle(arrayLast(slides));
            return parseFloat(style.getPropertyValue(`margin-${endEdge}`));
          }
          function measureWithGaps() {
            return slideRects
              .map((rect, index, rects) => {
                const isFirst = !index,
                  isLast = index === arrayLastIndex(rects);
                return isFirst
                  ? slideSizes[index] + startGap
                  : isLast
                  ? slideSizes[index] + endGap
                  : rects[index + 1][startEdge] - rect[startEdge];
              })
              .map(mathAbs);
          }
          return { slideSizes, slideSizesWithGaps };
        }
        function SlidesToScroll(viewSize, slideSizesWithGaps, slidesToScroll) {
          const groupByNumber = isNumber(slidesToScroll);
          function byNumber(array, groupSize) {
            return arrayKeys(array)
              .filter((i) => i % groupSize === 0)
              .map((i) => array.slice(i, i + groupSize));
          }
          function bySize(array) {
            return arrayKeys(array)
              .reduce((groupSizes, i) => {
                const chunkSize = slideSizesWithGaps
                  .slice(arrayLast(groupSizes), i + 1)
                  .reduce((a, s) => a + s, 0);
                return !i || chunkSize > viewSize
                  ? groupSizes.concat(i)
                  : groupSizes;
              }, [])
              .map((start, i, groupSizes) =>
                array.slice(start, groupSizes[i + 1])
              );
          }
          function groupSlides(array) {
            return groupByNumber
              ? byNumber(array, slidesToScroll)
              : bySize(array);
          }
          return { groupSlides };
        }
        function Engine(
          root,
          container,
          slides,
          ownerDocument,
          ownerWindow,
          options,
          eventHandler,
          animations
        ) {
          const {
              align,
              axis: scrollAxis,
              direction: contentDirection,
              startIndex,
              inViewThreshold,
              loop,
              duration,
              dragFree,
              dragThreshold,
              slidesToScroll: groupSlides,
              skipSnaps,
              containScroll,
            } = options,
            containerRect = container.getBoundingClientRect(),
            slideRects = slides.map((slide) => slide.getBoundingClientRect()),
            direction = Direction(contentDirection),
            axis = Axis(scrollAxis, contentDirection),
            viewSize = axis.measureSize(containerRect),
            percentOfView = PercentOfView(viewSize),
            alignment = Alignment(align, viewSize),
            containSnaps = !loop && !!containScroll,
            readEdgeGap = loop || !!containScroll,
            { slideSizes, slideSizesWithGaps } = SlideSizes(
              axis,
              containerRect,
              slideRects,
              slides,
              readEdgeGap,
              ownerWindow
            ),
            slidesToScroll = SlidesToScroll(
              viewSize,
              slideSizesWithGaps,
              groupSlides
            ),
            { snaps, snapsAligned } = ScrollSnaps(
              axis,
              alignment,
              containerRect,
              slideRects,
              slideSizesWithGaps,
              slidesToScroll,
              containSnaps
            ),
            contentSize = -arrayLast(snaps) + arrayLast(slideSizesWithGaps),
            { snapsContained } = ScrollContain(
              viewSize,
              contentSize,
              snapsAligned,
              containScroll
            ),
            scrollSnaps = containSnaps ? snapsContained : snapsAligned,
            { limit } = ScrollLimit(contentSize, scrollSnaps, loop),
            index = Counter(arrayLastIndex(scrollSnaps), startIndex, loop),
            indexPrevious = index.clone(),
            slideIndexes = arrayKeys(slides),
            update = ({
              dragHandler,
              scrollBody: scrollBody2,
              scrollBounds,
              eventHandler: eventHandler2,
              animation: animation2,
              options: { loop: loop2 },
            }) => {
              const pointerDown = dragHandler.pointerDown();
              loop2 || scrollBounds.constrain(pointerDown);
              const hasSettled = scrollBody2.seek().settled();
              hasSettled &&
                !pointerDown &&
                (animation2.stop(), eventHandler2.emit("settle")),
                hasSettled || eventHandler2.emit("scroll");
            },
            render = (
              {
                scrollBody: scrollBody2,
                translate,
                location: location2,
                offsetLocation: offsetLocation2,
                scrollLooper,
                slideLooper,
                options: { loop: loop2 },
              },
              lagOffset
            ) => {
              const velocity = scrollBody2.velocity();
              offsetLocation2.set(
                location2.get() - velocity + velocity * lagOffset
              ),
                loop2 &&
                  (scrollLooper.loop(scrollBody2.direction()),
                  slideLooper.loop()),
                translate.to(offsetLocation2.get());
            },
            animation = {
              start: () => animations.start(engine),
              stop: () => animations.stop(engine),
              update: () => update(engine),
              render: (lagOffset) => render(engine, lagOffset),
            },
            friction = 0.68,
            startLocation = scrollSnaps[index.get()],
            location = Vector1D(startLocation),
            offsetLocation = Vector1D(startLocation),
            target = Vector1D(startLocation),
            scrollBody = ScrollBody(location, target, duration, friction),
            scrollTarget = ScrollTarget(
              loop,
              scrollSnaps,
              contentSize,
              limit,
              target
            ),
            scrollTo = ScrollTo(
              animation,
              index,
              indexPrevious,
              scrollTarget,
              scrollBody,
              target,
              eventHandler
            ),
            slidesInView = SlidesInView(
              viewSize,
              contentSize,
              slideSizes,
              snaps,
              limit,
              loop,
              inViewThreshold
            ),
            engine = {
              ownerDocument,
              ownerWindow,
              eventHandler,
              containerRect,
              slideRects,
              animation,
              axis,
              direction,
              dragHandler: DragHandler(
                axis,
                direction,
                root,
                ownerDocument,
                ownerWindow,
                target,
                DragTracker(axis, ownerWindow),
                location,
                animation,
                scrollTo,
                scrollBody,
                scrollTarget,
                index,
                eventHandler,
                percentOfView,
                dragFree,
                dragThreshold,
                skipSnaps,
                friction
              ),
              eventStore: EventStore(),
              percentOfView,
              index,
              indexPrevious,
              limit,
              location,
              offsetLocation,
              options,
              resizeHandler: ResizeHandler(
                container,
                eventHandler,
                ownerWindow,
                slides,
                axis
              ),
              scrollBody,
              scrollBounds: ScrollBounds(
                limit,
                location,
                target,
                scrollBody,
                percentOfView
              ),
              scrollLooper: ScrollLooper(contentSize, limit, offsetLocation, [
                location,
                offsetLocation,
                target,
              ]),
              scrollProgress: ScrollProgress(limit),
              scrollSnaps,
              scrollTarget,
              scrollTo,
              slideLooper: SlideLooper(
                axis,
                direction,
                viewSize,
                contentSize,
                slideSizesWithGaps,
                scrollSnaps,
                slidesInView,
                offsetLocation,
                slides
              ),
              slidesHandler: SlidesHandler(container, eventHandler),
              slidesInView,
              slideIndexes,
              slidesToScroll,
              target,
              translate: Translate(axis, direction, container),
            };
          return engine;
        }
        function Animations(ownerWindow) {
          const timeStep = 16.666666666666668;
          let engines = [],
            lastTimeStamp = null,
            lag = 0,
            animationFrame = 0;
          function animate(timeStamp) {
            lastTimeStamp || (lastTimeStamp = timeStamp);
            const elapsed = timeStamp - lastTimeStamp;
            for (lastTimeStamp = timeStamp, lag += elapsed; lag >= timeStep; )
              engines.forEach(({ animation }) => animation.update()),
                (lag -= timeStep);
            const lagOffset = mathAbs(lag / timeStep);
            engines.forEach(({ animation }) => animation.render(lagOffset)),
              animationFrame && ownerWindow.requestAnimationFrame(animate);
          }
          function start(engine) {
            engines.includes(engine) || engines.push(engine),
              !animationFrame &&
                (animationFrame = ownerWindow.requestAnimationFrame(animate));
          }
          function stop(engine) {
            (engines = engines.filter((e) => e !== engine)),
              !engines.length &&
                (ownerWindow.cancelAnimationFrame(animationFrame),
                (lastTimeStamp = null),
                (lag = 0),
                (animationFrame = 0));
          }
          function reset() {
            (lastTimeStamp = null), (lag = 0);
          }
          return { start, stop, reset, window: ownerWindow };
        }
        function EventHandler() {
          const listeners = {};
          let api;
          function init(emblaApi) {
            api = emblaApi;
          }
          function getListeners(evt) {
            return listeners[evt] || [];
          }
          function emit(evt) {
            return getListeners(evt).forEach((e) => e(api, evt)), self;
          }
          function on(evt, cb) {
            return (listeners[evt] = getListeners(evt).concat([cb])), self;
          }
          function off(evt, cb) {
            return (
              (listeners[evt] = getListeners(evt).filter((e) => e !== cb)), self
            );
          }
          const self = { init, emit, off, on };
          return self;
        }
        const defaultOptions = {
          align: "center",
          axis: "x",
          container: null,
          slides: null,
          containScroll: "trimSnaps",
          direction: "ltr",
          slidesToScroll: 1,
          breakpoints: {},
          dragFree: !1,
          dragThreshold: 10,
          inViewThreshold: 0,
          loop: !1,
          skipSnaps: !1,
          duration: 25,
          startIndex: 0,
          active: !0,
          watchDrag: !0,
          watchResize: !0,
          watchSlides: !0,
        };
        function OptionsHandler(ownerWindow) {
          function mergeOptions(optionsA, optionsB) {
            return objectsMergeDeep(optionsA, optionsB || {});
          }
          function optionsAtMedia(options) {
            const optionsAtMedia2 = options.breakpoints || {},
              matchedMediaOptions = objectKeys(optionsAtMedia2)
                .filter((media) => ownerWindow.matchMedia(media).matches)
                .map((media) => optionsAtMedia2[media])
                .reduce((a, mediaOption) => mergeOptions(a, mediaOption), {});
            return mergeOptions(options, matchedMediaOptions);
          }
          function optionsMediaQueries(optionsList) {
            return optionsList
              .map((options) => objectKeys(options.breakpoints || {}))
              .reduce((acc, mediaQueries) => acc.concat(mediaQueries), [])
              .map(ownerWindow.matchMedia);
          }
          return { mergeOptions, optionsAtMedia, optionsMediaQueries };
        }
        function PluginsHandler(optionsHandler) {
          let activePlugins = [];
          function init(plugins, emblaApi) {
            return (
              (activePlugins = plugins.filter(
                ({ options }) =>
                  optionsHandler.optionsAtMedia(options).active !== !1
              )),
              activePlugins.forEach((plugin) =>
                plugin.init(emblaApi, optionsHandler)
              ),
              plugins.reduce(
                (map, plugin) => Object.assign(map, { [plugin.name]: plugin }),
                {}
              )
            );
          }
          function destroy() {
            activePlugins = activePlugins.filter((plugin) => plugin.destroy());
          }
          return { init, destroy };
        }
        function EmblaCarousel(root, userOptions, userPlugins) {
          const ownerDocument = root.ownerDocument,
            ownerWindow = ownerDocument.defaultView,
            optionsHandler = OptionsHandler(ownerWindow),
            pluginsHandler = PluginsHandler(optionsHandler),
            mediaHandlers = EventStore(),
            documentVisibleHandler = EventStore(),
            eventHandler = EventHandler(),
            { animationRealms } = EmblaCarousel,
            { mergeOptions, optionsAtMedia, optionsMediaQueries } =
              optionsHandler,
            { on, off, emit } = eventHandler,
            reInit = reActivate;
          let destroyed = !1,
            engine,
            optionsBase = mergeOptions(
              defaultOptions,
              EmblaCarousel.globalOptions
            ),
            options = mergeOptions(optionsBase),
            pluginList = [],
            pluginApis,
            container,
            slides;
          function storeElements() {
            const { container: userContainer, slides: userSlides } = options;
            container =
              (isString(userContainer)
                ? root.querySelector(userContainer)
                : userContainer) || root.children[0];
            const customSlides = isString(userSlides)
              ? container.querySelectorAll(userSlides)
              : userSlides;
            slides = [].slice.call(customSlides || container.children);
          }
          function createEngine(options2, animations) {
            const engine2 = Engine(
              root,
              container,
              slides,
              ownerDocument,
              ownerWindow,
              options2,
              eventHandler,
              animations
            );
            if (options2.loop && !engine2.slideLooper.canLoop()) {
              const optionsWithoutLoop = Object.assign({}, options2, {
                loop: !1,
              });
              return createEngine(optionsWithoutLoop, animations);
            }
            return engine2;
          }
          function activate(withOptions, withPlugins) {
            if (destroyed) return;
            const animationRealm = animationRealms.find(
                (a) => a.window === ownerWindow
              ),
              animations = animationRealm || Animations(ownerWindow);
            animationRealm || animationRealms.push(animations),
              (optionsBase = mergeOptions(optionsBase, withOptions)),
              (options = optionsAtMedia(optionsBase)),
              (pluginList = withPlugins || pluginList),
              storeElements(),
              (engine = createEngine(options, animations)),
              optionsMediaQueries([
                optionsBase,
                ...pluginList.map(({ options: options2 }) => options2),
              ]).forEach((query) =>
                mediaHandlers.add(query, "change", reActivate)
              ),
              options.active &&
                (engine.translate.to(engine.location.get()),
                engine.eventHandler.init(self),
                engine.resizeHandler.init(self, options.watchResize),
                engine.slidesHandler.init(self, options.watchSlides),
                documentVisibleHandler.add(
                  ownerDocument,
                  "visibilitychange",
                  () => {
                    ownerDocument.hidden && animations.reset();
                  }
                ),
                engine.options.loop && engine.slideLooper.loop(),
                container.offsetParent &&
                  slides.length &&
                  engine.dragHandler.init(self, options.watchDrag),
                (pluginApis = pluginsHandler.init(pluginList, self)));
          }
          function reActivate(withOptions, withPlugins) {
            const startIndex = selectedScrollSnap();
            deActivate(),
              activate(mergeOptions({ startIndex }, withOptions), withPlugins),
              eventHandler.emit("reInit");
          }
          function deActivate() {
            engine.dragHandler.destroy(),
              engine.animation.stop(),
              engine.eventStore.clear(),
              engine.translate.clear(),
              engine.slideLooper.clear(),
              engine.resizeHandler.destroy(),
              engine.slidesHandler.destroy(),
              pluginsHandler.destroy(),
              mediaHandlers.clear(),
              documentVisibleHandler.clear();
          }
          function destroy() {
            destroyed ||
              ((destroyed = !0),
              mediaHandlers.clear(),
              deActivate(),
              eventHandler.emit("destroy"));
          }
          function slidesInView(target) {
            const location = engine[target ? "target" : "location"].get(),
              type = options.loop ? "removeOffset" : "constrain";
            return engine.slidesInView.check(engine.limit[type](location));
          }
          function slidesNotInView(target) {
            const inView = slidesInView(target);
            return engine.slideIndexes.filter(
              (index) => !inView.includes(index)
            );
          }
          function scrollTo(index, jump, direction) {
            !options.active ||
              destroyed ||
              (engine.scrollBody
                .useBaseFriction()
                .useDuration(jump ? 0 : options.duration),
              engine.scrollTo.index(index, direction || 0));
          }
          function scrollNext(jump) {
            const next = engine.index.add(1).get();
            scrollTo(next, jump === !0, -1);
          }
          function scrollPrev(jump) {
            const prev = engine.index.add(-1).get();
            scrollTo(prev, jump === !0, 1);
          }
          function canScrollNext() {
            return engine.index.add(1).get() !== selectedScrollSnap();
          }
          function canScrollPrev() {
            return engine.index.add(-1).get() !== selectedScrollSnap();
          }
          function scrollSnapList() {
            return engine.scrollSnaps.map(engine.scrollProgress.get);
          }
          function scrollProgress() {
            return engine.scrollProgress.get(engine.location.get());
          }
          function selectedScrollSnap() {
            return engine.index.get();
          }
          function previousScrollSnap() {
            return engine.indexPrevious.get();
          }
          function plugins() {
            return pluginApis;
          }
          function internalEngine() {
            return engine;
          }
          function rootNode() {
            return root;
          }
          function containerNode() {
            return container;
          }
          function slideNodes() {
            return slides;
          }
          const self = {
            canScrollNext,
            canScrollPrev,
            containerNode,
            internalEngine,
            destroy,
            off,
            on,
            emit,
            plugins,
            previousScrollSnap,
            reInit,
            rootNode,
            scrollNext,
            scrollPrev,
            scrollProgress,
            scrollSnapList,
            scrollTo,
            selectedScrollSnap,
            slideNodes,
            slidesInView,
            slidesNotInView,
          };
          return (
            activate(userOptions, userPlugins),
            setTimeout(() => eventHandler.emit("init"), 0),
            self
          );
        }
        (EmblaCarousel.animationRealms = []),
          (EmblaCarousel.globalOptions = void 0);
      },
      7090: function (module) {
        (function (window2, factory) {
          var lazySizes = factory(window2, window2.document, Date);
          (window2.lazySizes = lazySizes),
            module.exports && (module.exports = lazySizes);
        })(
          typeof window < "u" ? window : {},
          function (window2, document2, Date2) {
            "use strict";
            var lazysizes, lazySizesCfg;
            if (
              ((function () {
                var prop,
                  lazySizesDefaults = {
                    lazyClass: "lazyload",
                    loadedClass: "lazyloaded",
                    loadingClass: "lazyloading",
                    preloadClass: "lazypreload",
                    errorClass: "lazyerror",
                    autosizesClass: "lazyautosizes",
                    fastLoadedClass: "ls-is-cached",
                    iframeLoadMode: 0,
                    srcAttr: "data-src",
                    srcsetAttr: "data-srcset",
                    sizesAttr: "data-sizes",
                    minSize: 40,
                    customMedia: {},
                    init: !0,
                    expFactor: 1.5,
                    hFac: 0.8,
                    loadMode: 2,
                    loadHidden: !0,
                    ricTimeout: 0,
                    throttleDelay: 125,
                  };
                lazySizesCfg =
                  window2.lazySizesConfig || window2.lazysizesConfig || {};
                for (prop in lazySizesDefaults)
                  prop in lazySizesCfg ||
                    (lazySizesCfg[prop] = lazySizesDefaults[prop]);
              })(),
              !document2 || !document2.getElementsByClassName)
            )
              return { init: function () {}, cfg: lazySizesCfg, noSupport: !0 };
            var docElem = document2.documentElement,
              supportPicture = window2.HTMLPictureElement,
              _addEventListener = "addEventListener",
              _getAttribute = "getAttribute",
              addEventListener = window2[_addEventListener].bind(window2),
              setTimeout2 = window2.setTimeout,
              requestAnimationFrame2 =
                window2.requestAnimationFrame || setTimeout2,
              requestIdleCallback = window2.requestIdleCallback,
              regPicture = /^picture$/i,
              loadEvents = ["load", "error", "lazyincluded", "_lazyloaded"],
              regClassCache = {},
              forEach = Array.prototype.forEach,
              hasClass = function (ele, cls) {
                return (
                  regClassCache[cls] ||
                    (regClassCache[cls] = new RegExp(
                      "(\\s|^)" + cls + "(\\s|$)"
                    )),
                  regClassCache[cls].test(ele[_getAttribute]("class") || "") &&
                    regClassCache[cls]
                );
              },
              addClass = function (ele, cls) {
                hasClass(ele, cls) ||
                  ele.setAttribute(
                    "class",
                    (ele[_getAttribute]("class") || "").trim() + " " + cls
                  );
              },
              removeClass = function (ele, cls) {
                var reg;
                (reg = hasClass(ele, cls)) &&
                  ele.setAttribute(
                    "class",
                    (ele[_getAttribute]("class") || "").replace(reg, " ")
                  );
              },
              addRemoveLoadEvents = function (dom, fn, add) {
                var action = add ? _addEventListener : "removeEventListener";
                add && addRemoveLoadEvents(dom, fn),
                  loadEvents.forEach(function (evt) {
                    dom[action](evt, fn);
                  });
              },
              triggerEvent = function (
                elem,
                name,
                detail,
                noBubbles,
                noCancelable
              ) {
                var event = document2.createEvent("Event");
                return (
                  detail || (detail = {}),
                  (detail.instance = lazysizes),
                  event.initEvent(name, !noBubbles, !noCancelable),
                  (event.detail = detail),
                  elem.dispatchEvent(event),
                  event
                );
              },
              updatePolyfill = function (el, full) {
                var polyfill;
                !supportPicture &&
                (polyfill = window2.picturefill || lazySizesCfg.pf)
                  ? (full &&
                      full.src &&
                      !el[_getAttribute]("srcset") &&
                      el.setAttribute("srcset", full.src),
                    polyfill({ reevaluate: !0, elements: [el] }))
                  : full && full.src && (el.src = full.src);
              },
              getCSS = function (elem, style) {
                return (getComputedStyle(elem, null) || {})[style];
              },
              getWidth = function (elem, parent, width) {
                for (
                  width = width || elem.offsetWidth;
                  width < lazySizesCfg.minSize &&
                  parent &&
                  !elem._lazysizesWidth;

                )
                  (width = parent.offsetWidth), (parent = parent.parentNode);
                return width;
              },
              rAF = (function () {
                var running,
                  waiting,
                  firstFns = [],
                  secondFns = [],
                  fns = firstFns,
                  run = function () {
                    var runFns = fns;
                    for (
                      fns = firstFns.length ? secondFns : firstFns,
                        running = !0,
                        waiting = !1;
                      runFns.length;

                    )
                      runFns.shift()();
                    running = !1;
                  },
                  rafBatch = function (fn, queue) {
                    running && !queue
                      ? fn.apply(this, arguments)
                      : (fns.push(fn),
                        waiting ||
                          ((waiting = !0),
                          (document2.hidden
                            ? setTimeout2
                            : requestAnimationFrame2)(run)));
                  };
                return (rafBatch._lsFlush = run), rafBatch;
              })(),
              rAFIt = function (fn, simple) {
                return simple
                  ? function () {
                      rAF(fn);
                    }
                  : function () {
                      var that = this,
                        args = arguments;
                      rAF(function () {
                        fn.apply(that, args);
                      });
                    };
              },
              throttle = function (fn) {
                var running,
                  lastTime = 0,
                  gDelay = lazySizesCfg.throttleDelay,
                  rICTimeout = lazySizesCfg.ricTimeout,
                  run = function () {
                    (running = !1), (lastTime = Date2.now()), fn();
                  },
                  idleCallback =
                    requestIdleCallback && rICTimeout > 49
                      ? function () {
                          requestIdleCallback(run, { timeout: rICTimeout }),
                            rICTimeout !== lazySizesCfg.ricTimeout &&
                              (rICTimeout = lazySizesCfg.ricTimeout);
                        }
                      : rAFIt(function () {
                          setTimeout2(run);
                        }, !0);
                return function (isPriority) {
                  var delay;
                  (isPriority = isPriority === !0) && (rICTimeout = 33),
                    !running &&
                      ((running = !0),
                      (delay = gDelay - (Date2.now() - lastTime)),
                      delay < 0 && (delay = 0),
                      isPriority || delay < 9
                        ? idleCallback()
                        : setTimeout2(idleCallback, delay));
                };
              },
              debounce = function (func) {
                var timeout,
                  timestamp,
                  wait = 99,
                  run = function () {
                    (timeout = null), func();
                  },
                  later = function () {
                    var last = Date2.now() - timestamp;
                    last < wait
                      ? setTimeout2(later, wait - last)
                      : (requestIdleCallback || run)(run);
                  };
                return function () {
                  (timestamp = Date2.now()),
                    timeout || (timeout = setTimeout2(later, wait));
                };
              },
              loader = (function () {
                var preloadElems,
                  isCompleted,
                  resetPreloadingTimer,
                  loadMode,
                  started,
                  eLvW,
                  elvH,
                  eLtop,
                  eLleft,
                  eLright,
                  eLbottom,
                  isBodyHidden,
                  regImg = /^img$/i,
                  regIframe = /^iframe$/i,
                  supportScroll =
                    "onscroll" in window2 &&
                    !/(gle|ing)bot/.test(navigator.userAgent),
                  shrinkExpand = 0,
                  currentExpand = 0,
                  isLoading = 0,
                  lowRuns = -1,
                  resetPreloading = function (e) {
                    isLoading--,
                      (!e || isLoading < 0 || !e.target) && (isLoading = 0);
                  },
                  isVisible = function (elem) {
                    return (
                      isBodyHidden == null &&
                        (isBodyHidden =
                          getCSS(document2.body, "visibility") == "hidden"),
                      isBodyHidden ||
                        !(
                          getCSS(elem.parentNode, "visibility") == "hidden" &&
                          getCSS(elem, "visibility") == "hidden"
                        )
                    );
                  },
                  isNestedVisible = function (elem, elemExpand) {
                    var outerRect,
                      parent = elem,
                      visible = isVisible(elem);
                    for (
                      eLtop -= elemExpand,
                        eLbottom += elemExpand,
                        eLleft -= elemExpand,
                        eLright += elemExpand;
                      visible &&
                      (parent = parent.offsetParent) &&
                      parent != document2.body &&
                      parent != docElem;

                    )
                      (visible = (getCSS(parent, "opacity") || 1) > 0),
                        visible &&
                          getCSS(parent, "overflow") != "visible" &&
                          ((outerRect = parent.getBoundingClientRect()),
                          (visible =
                            eLright > outerRect.left &&
                            eLleft < outerRect.right &&
                            eLbottom > outerRect.top - 1 &&
                            eLtop < outerRect.bottom + 1));
                    return visible;
                  },
                  checkElements = function () {
                    var eLlen,
                      i,
                      rect,
                      autoLoadElem,
                      loadedSomething,
                      elemExpand,
                      elemNegativeExpand,
                      elemExpandVal,
                      beforeExpandVal,
                      defaultExpand,
                      preloadExpand,
                      hFac,
                      lazyloadElems = lazysizes.elements;
                    if (
                      (loadMode = lazySizesCfg.loadMode) &&
                      isLoading < 8 &&
                      (eLlen = lazyloadElems.length)
                    ) {
                      for (i = 0, lowRuns++; i < eLlen; i++)
                        if (
                          !(!lazyloadElems[i] || lazyloadElems[i]._lazyRace)
                        ) {
                          if (
                            !supportScroll ||
                            (lazysizes.prematureUnveil &&
                              lazysizes.prematureUnveil(lazyloadElems[i]))
                          ) {
                            unveilElement(lazyloadElems[i]);
                            continue;
                          }
                          if (
                            ((!(elemExpandVal =
                              lazyloadElems[i][_getAttribute]("data-expand")) ||
                              !(elemExpand = elemExpandVal * 1)) &&
                              (elemExpand = currentExpand),
                            defaultExpand ||
                              ((defaultExpand =
                                !lazySizesCfg.expand || lazySizesCfg.expand < 1
                                  ? docElem.clientHeight > 500 &&
                                    docElem.clientWidth > 500
                                    ? 500
                                    : 370
                                  : lazySizesCfg.expand),
                              (lazysizes._defEx = defaultExpand),
                              (preloadExpand =
                                defaultExpand * lazySizesCfg.expFactor),
                              (hFac = lazySizesCfg.hFac),
                              (isBodyHidden = null),
                              currentExpand < preloadExpand &&
                              isLoading < 1 &&
                              lowRuns > 2 &&
                              loadMode > 2 &&
                              !document2.hidden
                                ? ((currentExpand = preloadExpand),
                                  (lowRuns = 0))
                                : loadMode > 1 && lowRuns > 1 && isLoading < 6
                                ? (currentExpand = defaultExpand)
                                : (currentExpand = shrinkExpand)),
                            beforeExpandVal !== elemExpand &&
                              ((eLvW = innerWidth + elemExpand * hFac),
                              (elvH = innerHeight + elemExpand),
                              (elemNegativeExpand = elemExpand * -1),
                              (beforeExpandVal = elemExpand)),
                            (rect = lazyloadElems[i].getBoundingClientRect()),
                            (eLbottom = rect.bottom) >= elemNegativeExpand &&
                              (eLtop = rect.top) <= elvH &&
                              (eLright = rect.right) >=
                                elemNegativeExpand * hFac &&
                              (eLleft = rect.left) <= eLvW &&
                              (eLbottom || eLright || eLleft || eLtop) &&
                              (lazySizesCfg.loadHidden ||
                                isVisible(lazyloadElems[i])) &&
                              ((isCompleted &&
                                isLoading < 3 &&
                                !elemExpandVal &&
                                (loadMode < 3 || lowRuns < 4)) ||
                                isNestedVisible(lazyloadElems[i], elemExpand)))
                          ) {
                            if (
                              (unveilElement(lazyloadElems[i]),
                              (loadedSomething = !0),
                              isLoading > 9)
                            )
                              break;
                          } else
                            !loadedSomething &&
                              isCompleted &&
                              !autoLoadElem &&
                              isLoading < 4 &&
                              lowRuns < 4 &&
                              loadMode > 2 &&
                              (preloadElems[0] ||
                                lazySizesCfg.preloadAfterLoad) &&
                              (preloadElems[0] ||
                                (!elemExpandVal &&
                                  (eLbottom ||
                                    eLright ||
                                    eLleft ||
                                    eLtop ||
                                    lazyloadElems[i][_getAttribute](
                                      lazySizesCfg.sizesAttr
                                    ) != "auto"))) &&
                              (autoLoadElem =
                                preloadElems[0] || lazyloadElems[i]);
                        }
                      autoLoadElem &&
                        !loadedSomething &&
                        unveilElement(autoLoadElem);
                    }
                  },
                  throttledCheckElements = throttle(checkElements),
                  switchLoadingClass = function (e) {
                    var elem = e.target;
                    if (elem._lazyCache) {
                      delete elem._lazyCache;
                      return;
                    }
                    resetPreloading(e),
                      addClass(elem, lazySizesCfg.loadedClass),
                      removeClass(elem, lazySizesCfg.loadingClass),
                      addRemoveLoadEvents(elem, rafSwitchLoadingClass),
                      triggerEvent(elem, "lazyloaded");
                  },
                  rafedSwitchLoadingClass = rAFIt(switchLoadingClass),
                  rafSwitchLoadingClass = function (e) {
                    rafedSwitchLoadingClass({ target: e.target });
                  },
                  changeIframeSrc = function (elem, src) {
                    var loadMode2 =
                      elem.getAttribute("data-load-mode") ||
                      lazySizesCfg.iframeLoadMode;
                    loadMode2 == 0
                      ? elem.contentWindow.location.replace(src)
                      : loadMode2 == 1 && (elem.src = src);
                  },
                  handleSources = function (source) {
                    var customMedia,
                      sourceSrcset = source[_getAttribute](
                        lazySizesCfg.srcsetAttr
                      );
                    (customMedia =
                      lazySizesCfg.customMedia[
                        source[_getAttribute]("data-media") ||
                          source[_getAttribute]("media")
                      ]) && source.setAttribute("media", customMedia),
                      sourceSrcset &&
                        source.setAttribute("srcset", sourceSrcset);
                  },
                  lazyUnveil = rAFIt(function (
                    elem,
                    detail,
                    isAuto,
                    sizes,
                    isImg
                  ) {
                    var src, srcset, parent, isPicture, event, firesLoad;
                    (event = triggerEvent(elem, "lazybeforeunveil", detail))
                      .defaultPrevented ||
                      (sizes &&
                        (isAuto
                          ? addClass(elem, lazySizesCfg.autosizesClass)
                          : elem.setAttribute("sizes", sizes)),
                      (srcset = elem[_getAttribute](lazySizesCfg.srcsetAttr)),
                      (src = elem[_getAttribute](lazySizesCfg.srcAttr)),
                      isImg &&
                        ((parent = elem.parentNode),
                        (isPicture =
                          parent && regPicture.test(parent.nodeName || ""))),
                      (firesLoad =
                        detail.firesLoad ||
                        ("src" in elem && (srcset || src || isPicture))),
                      (event = { target: elem }),
                      addClass(elem, lazySizesCfg.loadingClass),
                      firesLoad &&
                        (clearTimeout(resetPreloadingTimer),
                        (resetPreloadingTimer = setTimeout2(
                          resetPreloading,
                          2500
                        )),
                        addRemoveLoadEvents(elem, rafSwitchLoadingClass, !0)),
                      isPicture &&
                        forEach.call(
                          parent.getElementsByTagName("source"),
                          handleSources
                        ),
                      srcset
                        ? elem.setAttribute("srcset", srcset)
                        : src &&
                          !isPicture &&
                          (regIframe.test(elem.nodeName)
                            ? changeIframeSrc(elem, src)
                            : (elem.src = src)),
                      isImg &&
                        (srcset || isPicture) &&
                        updatePolyfill(elem, { src })),
                      elem._lazyRace && delete elem._lazyRace,
                      removeClass(elem, lazySizesCfg.lazyClass),
                      rAF(function () {
                        var isLoaded = elem.complete && elem.naturalWidth > 1;
                        (!firesLoad || isLoaded) &&
                          (isLoaded &&
                            addClass(elem, lazySizesCfg.fastLoadedClass),
                          switchLoadingClass(event),
                          (elem._lazyCache = !0),
                          setTimeout2(function () {
                            "_lazyCache" in elem && delete elem._lazyCache;
                          }, 9)),
                          elem.loading == "lazy" && isLoading--;
                      }, !0);
                  }),
                  unveilElement = function (elem) {
                    if (!elem._lazyRace) {
                      var detail,
                        isImg = regImg.test(elem.nodeName),
                        sizes =
                          isImg &&
                          (elem[_getAttribute](lazySizesCfg.sizesAttr) ||
                            elem[_getAttribute]("sizes")),
                        isAuto = sizes == "auto";
                      ((isAuto || !isCompleted) &&
                        isImg &&
                        (elem[_getAttribute]("src") || elem.srcset) &&
                        !elem.complete &&
                        !hasClass(elem, lazySizesCfg.errorClass) &&
                        hasClass(elem, lazySizesCfg.lazyClass)) ||
                        ((detail = triggerEvent(elem, "lazyunveilread").detail),
                        isAuto &&
                          autoSizer.updateElem(elem, !0, elem.offsetWidth),
                        (elem._lazyRace = !0),
                        isLoading++,
                        lazyUnveil(elem, detail, isAuto, sizes, isImg));
                    }
                  },
                  afterScroll = debounce(function () {
                    (lazySizesCfg.loadMode = 3), throttledCheckElements();
                  }),
                  altLoadmodeScrollListner = function () {
                    lazySizesCfg.loadMode == 3 && (lazySizesCfg.loadMode = 2),
                      afterScroll();
                  },
                  onload = function () {
                    if (!isCompleted) {
                      if (Date2.now() - started < 999) {
                        setTimeout2(onload, 999);
                        return;
                      }
                      (isCompleted = !0),
                        (lazySizesCfg.loadMode = 3),
                        throttledCheckElements(),
                        addEventListener(
                          "scroll",
                          altLoadmodeScrollListner,
                          !0
                        );
                    }
                  };
                return {
                  _: function () {
                    (started = Date2.now()),
                      (lazysizes.elements = document2.getElementsByClassName(
                        lazySizesCfg.lazyClass
                      )),
                      (preloadElems = document2.getElementsByClassName(
                        lazySizesCfg.lazyClass + " " + lazySizesCfg.preloadClass
                      )),
                      addEventListener("scroll", throttledCheckElements, !0),
                      addEventListener("resize", throttledCheckElements, !0),
                      addEventListener("pageshow", function (e) {
                        if (e.persisted) {
                          var loadingElements = document2.querySelectorAll(
                            "." + lazySizesCfg.loadingClass
                          );
                          loadingElements.length &&
                            loadingElements.forEach &&
                            requestAnimationFrame2(function () {
                              loadingElements.forEach(function (img) {
                                img.complete && unveilElement(img);
                              });
                            });
                        }
                      }),
                      window2.MutationObserver
                        ? new MutationObserver(throttledCheckElements).observe(
                            docElem,
                            { childList: !0, subtree: !0, attributes: !0 }
                          )
                        : (docElem[_addEventListener](
                            "DOMNodeInserted",
                            throttledCheckElements,
                            !0
                          ),
                          docElem[_addEventListener](
                            "DOMAttrModified",
                            throttledCheckElements,
                            !0
                          ),
                          setInterval(throttledCheckElements, 999)),
                      addEventListener(
                        "hashchange",
                        throttledCheckElements,
                        !0
                      ),
                      [
                        "focus",
                        "mouseover",
                        "click",
                        "load",
                        "transitionend",
                        "animationend",
                      ].forEach(function (name) {
                        document2[_addEventListener](
                          name,
                          throttledCheckElements,
                          !0
                        );
                      }),
                      /d$|^c/.test(document2.readyState)
                        ? onload()
                        : (addEventListener("load", onload),
                          document2[_addEventListener](
                            "DOMContentLoaded",
                            throttledCheckElements
                          ),
                          setTimeout2(onload, 2e4)),
                      lazysizes.elements.length
                        ? (checkElements(), rAF._lsFlush())
                        : throttledCheckElements();
                  },
                  checkElems: throttledCheckElements,
                  unveil: unveilElement,
                  _aLSL: altLoadmodeScrollListner,
                };
              })(),
              autoSizer = (function () {
                var autosizesElems,
                  sizeElement = rAFIt(function (elem, parent, event, width) {
                    var sources, i, len;
                    if (
                      ((elem._lazysizesWidth = width),
                      (width += "px"),
                      elem.setAttribute("sizes", width),
                      regPicture.test(parent.nodeName || ""))
                    )
                      for (
                        sources = parent.getElementsByTagName("source"),
                          i = 0,
                          len = sources.length;
                        i < len;
                        i++
                      )
                        sources[i].setAttribute("sizes", width);
                    event.detail.dataAttr || updatePolyfill(elem, event.detail);
                  }),
                  getSizeElement = function (elem, dataAttr, width) {
                    var event,
                      parent = elem.parentNode;
                    parent &&
                      ((width = getWidth(elem, parent, width)),
                      (event = triggerEvent(elem, "lazybeforesizes", {
                        width,
                        dataAttr: !!dataAttr,
                      })),
                      event.defaultPrevented ||
                        ((width = event.detail.width),
                        width &&
                          width !== elem._lazysizesWidth &&
                          sizeElement(elem, parent, event, width)));
                  },
                  updateElementsSizes = function () {
                    var i,
                      len = autosizesElems.length;
                    if (len)
                      for (i = 0; i < len; i++)
                        getSizeElement(autosizesElems[i]);
                  },
                  debouncedUpdateElementsSizes = debounce(updateElementsSizes);
                return {
                  _: function () {
                    (autosizesElems = document2.getElementsByClassName(
                      lazySizesCfg.autosizesClass
                    )),
                      addEventListener("resize", debouncedUpdateElementsSizes);
                  },
                  checkElems: debouncedUpdateElementsSizes,
                  updateElem: getSizeElement,
                };
              })(),
              init = function () {
                !init.i &&
                  document2.getElementsByClassName &&
                  ((init.i = !0), autoSizer._(), loader._());
              };
            return (
              setTimeout2(function () {
                lazySizesCfg.init && init();
              }),
              (lazysizes = {
                cfg: lazySizesCfg,
                autoSizer,
                loader,
                init,
                uP: updatePolyfill,
                aC: addClass,
                rC: removeClass,
                hC: hasClass,
                fire: triggerEvent,
                gW: getWidth,
                rAF,
              }),
              lazysizes
            );
          }
        );
      },
      1770: function (module, exports, __webpack_require__2) {
        var __WEBPACK_AMD_DEFINE_FACTORY__,
          __WEBPACK_AMD_DEFINE_ARRAY__,
          __WEBPACK_AMD_DEFINE_RESULT__;
        (function (window2, factory) {
          if (window2) {
            var globalInstall = function () {
              factory(window2.lazySizes),
                window2.removeEventListener(
                  "lazyunveilread",
                  globalInstall,
                  !0
                );
            };
            (factory = factory.bind(null, window2, window2.document)),
              module.exports
                ? factory(__webpack_require__2(7090))
                : ((__WEBPACK_AMD_DEFINE_ARRAY__ = [
                    __webpack_require__2(7090),
                  ]),
                  (__WEBPACK_AMD_DEFINE_FACTORY__ = factory),
                  (__WEBPACK_AMD_DEFINE_RESULT__ =
                    typeof __WEBPACK_AMD_DEFINE_FACTORY__ == "function"
                      ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(
                          exports,
                          __WEBPACK_AMD_DEFINE_ARRAY__
                        )
                      : __WEBPACK_AMD_DEFINE_FACTORY__),
                  __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 &&
                    (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
          }
        })(
          typeof window < "u" ? window : 0,
          function (window2, document2, lazySizes) {
            "use strict";
            if (window2.addEventListener) {
              var regDescriptors = /\s+(\d+)(w|h)\s+(\d+)(w|h)/,
                regCssFit = /parent-fit["']*\s*:\s*["']*(contain|cover|width)/,
                regCssObject =
                  /parent-container["']*\s*:\s*["']*(.+?)(?=(\s|$|,|'|"|;))/,
                regPicture = /^picture$/i,
                cfg = lazySizes.cfg,
                getCSS = function (elem) {
                  return getComputedStyle(elem, null) || {};
                },
                parentFit = {
                  getParent: function (element, parentSel) {
                    var parent = element,
                      parentNode = element.parentNode;
                    return (
                      (!parentSel || parentSel == "prev") &&
                        parentNode &&
                        regPicture.test(parentNode.nodeName || "") &&
                        (parentNode = parentNode.parentNode),
                      parentSel != "self" &&
                        (parentSel == "prev"
                          ? (parent = element.previousElementSibling)
                          : parentSel && (parentNode.closest || window2.jQuery)
                          ? (parent =
                              (parentNode.closest
                                ? parentNode.closest(parentSel)
                                : jQuery(parentNode).closest(parentSel)[0]) ||
                              parentNode)
                          : (parent = parentNode)),
                      parent
                    );
                  },
                  getFit: function (element) {
                    var tmpMatch,
                      parentObj,
                      css = getCSS(element),
                      content = css.content || css.fontFamily,
                      obj = {
                        fit:
                          element._lazysizesParentFit ||
                          element.getAttribute("data-parent-fit"),
                      };
                    return (
                      !obj.fit &&
                        content &&
                        (tmpMatch = content.match(regCssFit)) &&
                        (obj.fit = tmpMatch[1]),
                      obj.fit
                        ? ((parentObj =
                            element._lazysizesParentContainer ||
                            element.getAttribute("data-parent-container")),
                          !parentObj &&
                            content &&
                            (tmpMatch = content.match(regCssObject)) &&
                            (parentObj = tmpMatch[1]),
                          (obj.parent = parentFit.getParent(
                            element,
                            parentObj
                          )))
                        : (obj.fit = css.objectFit),
                      obj
                    );
                  },
                  getImageRatio: function (element) {
                    var i,
                      srcset,
                      media,
                      ratio,
                      match,
                      width,
                      height,
                      parent = element.parentNode,
                      elements =
                        parent && regPicture.test(parent.nodeName || "")
                          ? parent.querySelectorAll("source, img")
                          : [element];
                    for (i = 0; i < elements.length; i++)
                      if (
                        ((element = elements[i]),
                        (srcset =
                          element.getAttribute(cfg.srcsetAttr) ||
                          element.getAttribute("srcset") ||
                          element.getAttribute("data-pfsrcset") ||
                          element.getAttribute("data-risrcset") ||
                          ""),
                        (media =
                          element._lsMedia || element.getAttribute("media")),
                        (media =
                          cfg.customMedia[
                            element.getAttribute("data-media") || media
                          ] || media),
                        srcset &&
                          (!media ||
                            ((window2.matchMedia && matchMedia(media)) || {})
                              .matches))
                      ) {
                        (ratio = parseFloat(
                          element.getAttribute("data-aspectratio")
                        )),
                          ratio ||
                            ((match = srcset.match(regDescriptors)),
                            match
                              ? match[2] == "w"
                                ? ((width = match[1]), (height = match[3]))
                                : ((width = match[3]), (height = match[1]))
                              : ((width = element.getAttribute("width")),
                                (height = element.getAttribute("height"))),
                            (ratio = width / height));
                        break;
                      }
                    return ratio;
                  },
                  calculateSize: function (element, width) {
                    var displayRatio,
                      height,
                      imageRatio,
                      retWidth,
                      fitObj = this.getFit(element),
                      fit = fitObj.fit,
                      fitElem = fitObj.parent;
                    return fit != "width" &&
                      ((fit != "contain" && fit != "cover") ||
                        !(imageRatio = this.getImageRatio(element)))
                      ? width
                      : (fitElem
                          ? (width = fitElem.clientWidth)
                          : (fitElem = element),
                        (retWidth = width),
                        fit == "width"
                          ? (retWidth = width)
                          : ((height = fitElem.clientHeight),
                            (displayRatio = width / height) &&
                              ((fit == "cover" && displayRatio < imageRatio) ||
                                (fit == "contain" &&
                                  displayRatio > imageRatio)) &&
                              (retWidth = width * (imageRatio / displayRatio))),
                        retWidth);
                  },
                };
              (lazySizes.parentFit = parentFit),
                document2.addEventListener("lazybeforesizes", function (e) {
                  if (!(e.defaultPrevented || e.detail.instance != lazySizes)) {
                    var element = e.target;
                    e.detail.width = parentFit.calculateSize(
                      element,
                      e.detail.width
                    );
                  }
                });
            }
          }
        );
      },
      5065: function (
        __unused_webpack_module,
        __webpack_exports__2,
        __webpack_require__2
      ) {
        "use strict";
        __webpack_require__2.r(__webpack_exports__2);
      },
      735: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartAPI = void 0);
        const { routes } = window;
        class CartAPI {
          change(config) {
            return fetch(routes.cart_change_url, config).then((response) =>
              response.text()
            );
          }
          add(config) {
            return fetch(routes.cart_add_url, config).then((response) =>
              response.text()
            );
          }
          update(config) {
            return fetch(routes.cart_update_url, config);
          }
          get() {
            return fetch(routes.cart_url).then((response) => response.text());
          }
          getDrawer() {
            return fetch(routes.root_url).then((response) => response.text());
          }
        }
        exports.CartAPI = CartAPI;
      },
      3191: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PredictiveSearchAPI = void 0);
        const { routes } = window;
        class PredictiveSearchAPI {
          get(params) {
            const { searchQuery, sectionParam, limitParam, fieldsParam } =
                params,
              baseUrl = routes.predictive_search_url;
            return fetch(
              `${baseUrl}?q=${searchQuery}&${limitParam}&${sectionParam}&${fieldsParam}`
            ).then((response) => response.text());
          }
        }
        exports.PredictiveSearchAPI = PredictiveSearchAPI;
      },
      9867: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.AccordeonButton = void 0);
        const base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          utils_1 = __webpack_require__2(4083),
          ACCORDEON_SELECTOR = "accordeon-component";
        class AccordeonButton extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "click", this.handleButtonClick),
              this.addListener(this, "keydown", this.handleKeyDown);
          }
          handleButtonClick = (event) => {
            event.preventDefault(), this.toggle();
          };
          handleKeyDown = (event) => {
            (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.toggle());
          };
          toggle() {
            (0, utils_1.$elParent)(ACCORDEON_SELECTOR, this)?.toggle();
          }
        }
        exports.AccordeonButton = AccordeonButton;
      },
      4604: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.AccordeonComponent = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          dom_1 = __webpack_require__2(3889),
          CONTENT_WRAP_SELECTOR = "[data-accordeon-content-wrap]",
          CONTENT_SELECTOR = "[data-accordeon-content]",
          BODY_ELEMENT_SELECTOR = "body-element";
        class AccordeonComponent extends base_component_1.BaseComponent {
          resizeObserver;
          isExpanded;
          mountComponent() {
            const content = (0, utils_1.$el)(CONTENT_SELECTOR, this);
            (this.isExpanded =
              this.getAttribute("data-aria-expanded") === "true"),
              this.updateHeight(),
              this.addListener(this, "focusout", this.handleAccordeonFocusout),
              (this.resizeObserver = new ResizeObserver(this.handleResize)),
              this.resizeObserver.observe(content),
              this.isEditor &&
                (this.editor.on("BLOCK_SELECT", this.handleBlockSelect),
                this.editor.on("BLOCK_DESELECT", this.handleBlockDeselect));
          }
          unmountComponent() {
            this.resizeObserver.disconnect();
          }
          handleAccordeonFocusout = () => {
            const bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR);
            !this.isExpanded && bodyElement.isUsingKeyboard && this.show();
          };
          handleResize = () => {
            this.updateHeight();
          };
          handleBlockSelect = ({ detail: { sectionId, blockId, load } }) => {
            if (
              this.dataset.sectionId === sectionId &&
              this.dataset.blockId === blockId &&
              !this.isExpanded
            ) {
              const content = (0, utils_1.$el)(CONTENT_SELECTOR, this);
              (0, dom_1.skipTransition)(content, load),
                this.show().then(() => {
                  (0, dom_1.skipTransition)(content, !1);
                });
            }
          };
          handleBlockDeselect = ({ detail: { sectionId, blockId } }) => {
            this.dataset.sectionId === sectionId &&
              this.dataset.blockId === blockId &&
              this.isExpanded &&
              this.hide();
          };
          async hide() {
            await this.setExpand(!1),
              this.emit("hide", { blockId: this.dataset.blockId });
          }
          async show() {
            await this.setExpand(!0),
              this.emit("show", { blockId: this.dataset.blockId });
          }
          async toggle() {
            await this.setExpand(!this.isExpanded),
              this.emit("toggle", { blockId: this.dataset.blockId });
          }
          updateHeight() {
            const contentWrap = (0, utils_1.$el)(CONTENT_WRAP_SELECTOR, this),
              content = (0, utils_1.$el)(CONTENT_SELECTOR, this);
            content &&
              (contentWrap.style.maxHeight = `${Math.ceil(
                this.isExpanded ? content.scrollHeight : 0
              )}px`);
          }
          async setExpand(isExpanded) {
            (this.isExpanded = isExpanded),
              this.setAttribute(
                "data-aria-expanded",
                isExpanded ? "true" : "false"
              ),
              this.updateHeight(),
              await (0, utils_1.transitionToPromise)(this);
          }
        }
        exports.AccordeonComponent = AccordeonComponent;
      },
      7606: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.AccordeonButton = exports.AccordeonComponent = void 0);
        var accordeon_1 = __webpack_require__2(4604);
        Object.defineProperty(exports, "AccordeonComponent", {
          enumerable: !0,
          get: function () {
            return accordeon_1.AccordeonComponent;
          },
        });
        var accordeon_button_1 = __webpack_require__2(9867);
        Object.defineProperty(exports, "AccordeonButton", {
          enumerable: !0,
          get: function () {
            return accordeon_button_1.AccordeonButton;
          },
        });
      },
      29: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 });
        const check_media_1 = __webpack_require__2(5580),
          utils_1 = __webpack_require__2(4083),
          SCROLL_ANIMATION_TRIGGER_CLASSNAME = "scroll-trigger",
          SCROLL_ANIMATION_OFFSCREEN_CLASSNAME = "scroll-trigger--offscreen",
          ZOOM_OUT_CLASSNAME = "animate--zoom-out",
          KEEP_OBSERVE_ATTRIBUTE = "data-keep-observe-animation",
          REMOVE_ANIMATION_CLASS_ATTRIBUTE = "data-remove-animation-class",
          IS_SLIDE_CLASSNAME = "slider-grid__slide",
          REGULAR_IMGAE_ZOOM_CLASSNAME = "zoom";
        function onIntersection(elements, observer) {
          elements.forEach((element, index) => {
            const elementTarget = element.target;
            element.isIntersecting
              ? handleIntersecting(elementTarget, index, observer)
              : handleNonIntersecting(elementTarget, observer);
          });
        }
        function handleIntersecting(elementTarget, index, observer) {
          elementTarget.classList.contains(
            SCROLL_ANIMATION_OFFSCREEN_CLASSNAME
          ) &&
            (elementTarget.classList.remove(
              SCROLL_ANIMATION_OFFSCREEN_CLASSNAME
            ),
            elementTarget.setAttribute(
              "style",
              `--gsc-animation-order: ${index};`
            )),
            (elementTarget.hasAttribute(REMOVE_ANIMATION_CLASS_ATTRIBUTE) ||
              elementTarget.classList.contains(REGULAR_IMGAE_ZOOM_CLASSNAME)) &&
              removeAnimationClasses(elementTarget),
            elementTarget.hasAttribute(KEEP_OBSERVE_ATTRIBUTE) ||
              observer.unobserve(elementTarget);
        }
        function handleNonIntersecting(elementTarget, observer) {
          (0, check_media_1.isMobile)() &&
          (elementTarget.classList.contains(IS_SLIDE_CLASSNAME) ||
            elementTarget.classList.contains(ZOOM_OUT_CLASSNAME)) &&
          elementTarget.getBoundingClientRect().left >
            document.body.getBoundingClientRect().width
            ? (elementTarget.classList.remove(
                SCROLL_ANIMATION_TRIGGER_CLASSNAME
              ),
              observer.unobserve(elementTarget))
            : elementTarget.classList.add(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
        }
        async function removeAnimationClasses(elementTarget) {
          await (0, utils_1.transitionToPromise)(elementTarget),
            elementTarget.classList.remove(SCROLL_ANIMATION_TRIGGER_CLASSNAME),
            elementTarget.removeAttribute("style");
        }
        function getObserverOptions() {
          const asidePaddings = getComputedStyle(
            document.body
          ).getPropertyValue("--gsc-aside-padding-size");
          return {
            rootMargin: `0px -${asidePaddings} -25px -${asidePaddings}`,
          };
        }
        function initializeScrollAnimationTrigger() {
          const animationTriggerElements = Array.from(
            document.getElementsByClassName(SCROLL_ANIMATION_TRIGGER_CLASSNAME)
          );
          if (animationTriggerElements.length === 0) return;
          const observer = new IntersectionObserver(
            onIntersection,
            getObserverOptions()
          );
          animationTriggerElements.forEach((element) =>
            observer.observe(element)
          );
        }
        window.addEventListener("DOMContentLoaded", () => {
          initializeScrollAnimationTrigger();
        });
      },
      5318: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.BackToTopButton = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          BUTTON_SELECTOR = "[data-back-to-top-button]";
        class BackToTopButton extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "keydown", this.handleKeydown),
              this.addListener(this, "click", this.handleButtonClick),
              this.addListener(window, "scroll", this.handleWindowScroll);
          }
          handleWindowScroll = () => {
            (0, utils_1.$el)(BUTTON_SELECTOR, this)?.classList.toggle(
              "is-visible",
              window.scrollY > window.innerHeight
            );
          };
          handleButtonClick = () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          };
          handleKeydown = (event) => {
            if ((0, key_1.isEnterKey)(event)) {
              const skipContent = (0, utils_1.$el)("#SkipContent");
              window.scrollTo({ top: 0, behavior: "instant" }),
                skipContent.focus();
            }
          };
        }
        exports.BackToTopButton = BackToTopButton;
      },
      1521: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.BackToTopButton = void 0);
        var back_to_top_button_1 = __webpack_require__2(5318);
        Object.defineProperty(exports, "BackToTopButton", {
          enumerable: !0,
          get: function () {
            return back_to_top_button_1.BackToTopButton;
          },
        });
      },
      2506: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.BaseComponent = void 0);
        const editor_1 = __webpack_require__2(6353),
          { Shopify: Shopify2 } = window;
        class BaseComponent extends HTMLElement {
          listeners = [];
          events = {};
          editor = new editor_1.ShopifyEditor();
          isEditor = Shopify2.designMode;
          connectedCallback() {
            try {
              this.mountComponent();
            } catch (error) {
              console.log(this.tagName, "mount", error.name),
                console.log(error);
            }
          }
          disconnectedCallback() {
            try {
              this.unmountComponent();
            } catch (error) {
              console.log(this.tagName, "unmount", error.name);
            }
            this.isEditor && this.editor.destroy(), this.destroyListeners();
          }
          mountComponent() {}
          unmountComponent() {}
          on(event, listener) {
            this.events[event] || (this.events[event] = []),
              this.events[event].push(listener);
          }
          off(event, removedListener) {
            this.events[event] &&
              (this.events[event] = this.events[event].filter(
                (listener) => listener !== removedListener
              ));
          }
          emit(event, data) {
            this.events[event] &&
              this.events[event].forEach((listener) => listener(data));
          }
          addListener(element, event, listener, options) {
            !element ||
              !event ||
              !listener ||
              (element.addEventListener(event, listener, options),
              (this.listeners = [
                ...this.listeners,
                { element, event, listener },
              ]));
          }
          removeListener(targetElement, targetEvent, targetListener) {
            !targetElement ||
              !targetEvent ||
              !targetListener ||
              (targetElement.removeEventListener(targetEvent, targetListener),
              (this.listeners = this.listeners.filter(
                ({ element, event, listener }) =>
                  element !== targetElement &&
                  event !== targetEvent &&
                  listener !== targetListener
              )));
          }
          destroyListeners() {
            this.listeners.forEach(({ element, event, listener }) => {
              element.removeEventListener(event, listener);
            }),
              (this.listeners = []);
          }
        }
        exports.BaseComponent = BaseComponent;
      },
      6353: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ShopifyEditor = void 0);
        const constants_1 = __webpack_require__2(3036);
        class ShopifyEditor {
          listeners = {};
          on(eventName, listener) {
            this.listeners[eventName] || (this.listeners[eventName] = []),
              document.addEventListener(
                constants_1.SHOPIFY_EVENTS[eventName],
                listener
              ),
              this.listeners[eventName].push(listener);
          }
          off(eventName, removedListener) {
            this.listeners[eventName] &&
              (document.removeEventListener(
                constants_1.SHOPIFY_EVENTS[eventName],
                removedListener
              ),
              (this.listeners[eventName] = this.listeners[eventName].filter(
                (listener) => listener !== removedListener
              )));
          }
          destroy() {
            Object.keys(this.listeners).forEach((event) => {
              this.listeners[event].forEach((listener) => {
                this.off(event, listener);
              });
            }),
              (this.listeners = {});
          }
        }
        exports.ShopifyEditor = ShopifyEditor;
      },
      3608: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ShopifyEditor = exports.BaseComponent = void 0);
        var base_component_1 = __webpack_require__2(2506);
        Object.defineProperty(exports, "BaseComponent", {
          enumerable: !0,
          get: function () {
            return base_component_1.BaseComponent;
          },
        });
        var editor_1 = __webpack_require__2(6353);
        Object.defineProperty(exports, "ShopifyEditor", {
          enumerable: !0,
          get: function () {
            return editor_1.ShopifyEditor;
          },
        });
      },
      3831: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.BodyElement = void 0);
        const product_breadcrumbs_1 = __webpack_require__2(9180),
          utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
        class BodyElement extends base_component_1.BaseComponent {
          notification;
          overlayCalls = [];
          isScrolling = !1;
          timeoutScrollId;
          removeOverlayTimeoutId;
          prefetchedLinks = [];
          isVisible;
          isFixed;
          fixedTopPosition;
          openedDialogWindows = [];
          lastFocusedTarget;
          currentFocusEl;
          isUsingKeyboard = !1;
          zIndex;
          scrollbarWidth;
          isOpenedOnFirefox;
          mountComponent() {
            this.setBreadcrumbs(),
              this.setViewportObserver(),
              this.setRegistrationMessage(),
              this.setNotification(),
              this.setThemeInfo(),
              (this.isFixed = !1),
              this.addListener(window, "wheel", this.handleWindowWheel),
              this.addListener(window, "beforeunload", this.handlePageChange),
              this.addListener(window, "pagehide", this.handlePageHide),
              this.addListener(window, "pageshow", this.handlePageShow),
              this.addListener(document, "mouseover", this.handleLinkOver),
              this.addListener(document, "mousedown", this.handleMousedown),
              this.addListener(document, "keydown", this.handleKeydown),
              this.addListener(document, "focusout", this.handleFocusout),
              this.removeLoadingOverlay("#GlobalLoadingOverlayDots"),
              (this.removeOverlayTimeoutId = setTimeout(() => {
                this.removeLoadingOverlay("#GlobalLoadingOverlayDots");
              }, 5e3));
          }
          unmountComponent() {
            clearTimeout(this.timeoutScrollId),
              clearTimeout(this.removeOverlayTimeoutId);
          }
          handleMousedown = () => {
            this.setUsingKeyboard(!1);
          };
          handleKeydown = () => {
            this.setUsingKeyboard(!0);
          };
          addDialogWindow(newWindowId) {
            this.openedDialogWindows.length === 0 &&
              this.openedDialogWindows.every(
                (windowId) => !this.currentFocusEl.closest(`[id="${windowId}"]`)
              ) &&
              (this.lastFocusedTarget =
                this.currentFocusEl || (0, utils_1.$el)("#MainContent")),
              this.openedDialogWindows.includes(newWindowId) ||
                (this.openedDialogWindows = [
                  ...this.openedDialogWindows,
                  newWindowId,
                ]);
          }
          removeDialogWindow(removedWindowId) {
            this.openedDialogWindows = this.openedDialogWindows.filter(
              (windowId) => windowId !== removedWindowId
            );
            const lastOpenedWindowId =
              this.openedDialogWindows[this.openedDialogWindows.length - 1];
            if (lastOpenedWindowId) {
              const lastOpenedWindow = (0, utils_1.$el)(
                  `#${lastOpenedWindowId}`
                ),
                { firstTarget } = (0, utils_1.getTargets)(lastOpenedWindow);
              firstTarget?.focus();
            } else
              this.lastFocusedTarget &&
                (this.lastFocusedTarget.focus(),
                (this.lastFocusedTarget = null));
          }
          isLastOpenedWindow(windowId) {
            return (
              this.openedDialogWindows[this.openedDialogWindows.length - 1] ===
              windowId
            );
          }
          setUsingKeyboard(usingKeyboard) {
            document.body.classList.toggle("using-keyboard", usingKeyboard),
              (this.isUsingKeyboard = usingKeyboard);
          }
          handleFocusout = (event) => {
            const focusTarget = event.relatedTarget;
            focusTarget && (this.currentFocusEl = focusTarget);
          };
          setBreadcrumbs() {
            if (window.location.pathname.includes("products")) {
              customElements.define(
                "product-breadcrumbs",
                product_breadcrumbs_1.ProductBreadcrumbs
              );
              const breadcrumbs = (0, utils_1.$list)("product-breadcrumbs");
              if (breadcrumbs.length) {
                const page = localStorage.getItem("prevCollectionPage");
                breadcrumbs.forEach((el) => el.setCollectionPage(page)),
                  localStorage.removeItem("prevCollectionPage");
              }
            } else
              window.location.pathname.includes("collections") ||
                localStorage.removeItem("prevCollectionPage");
          }
          setViewportObserver() {
            (0, utils_1.$list)(".shopify-section").forEach((section) => {
              utils_1.viewportObserver.observe(section);
            });
          }
          setThemeInfo() {
            window.auroraTheme = {
              ...window.auroraTheme,
              theme_version: "3.4.1",
              id: window.Shopify.theme.id,
              storeId: window.Shopify.theme.theme_store_id,
              isLicenseTheme: !!window.Shopify.theme.theme_store_id,
            };
          }
          handleWindowWheel = () => {
            this.timeoutScrollId &&
              (clearTimeout(this.timeoutScrollId), (this.isScrolling = !0)),
              (this.timeoutScrollId = setTimeout(() => {
                this.isScrolling = !1;
              }, 200));
          };
          handleLinkOver = (event) => {
            const link = (0, utils_1.$elParent)("a[href]", event.target),
              href = link?.href;
            if (!href || link?.hasAttribute("without-prefetch-on-hover"))
              return;
            const wasPrefetched = this.prefetchedLinks.includes(href),
              isNotPrefetchetable =
                (0, utils_1.isExternalLink)(href) ||
                (0, utils_1.isCurrentPageLink)(href);
            wasPrefetched ||
              isNotPrefetchetable ||
              ((0, utils_1.createPrefetchLink)(href),
              this.prefetchedLinks.push(href));
          };
          handlePageChange = () => {
            this.showLoadingOverlay("#GlobalLoadingOverlayDots");
          };
          handlePageHide = () => {
            this.removeLoadingOverlay("#GlobalLoadingOverlayDots");
          };
          handlePageShow = () => {
            this.removeLoadingOverlay("#GlobalLoadingOverlayDots");
          };
          showLoadingOverlay = (selector) => {
            this.setScrollLock();
            const loadingOverlay = (0, utils_1.$el)(selector);
            loadingOverlay.classList.remove("hidden"),
              requestAnimationFrame(() => {
                loadingOverlay.style.opacity = "1";
              });
          };
          removeLoadingOverlay = async (selector) => {
            const loadingOverlay = (0, utils_1.$el)(selector);
            loadingOverlay.classList.contains("hidden") ||
              ((loadingOverlay.style.opacity = "0"),
              await (0, utils_1.transitionToPromise)(loadingOverlay),
              loadingOverlay.classList.add("hidden"),
              this.unsetScrollLock());
          };
          setNotification() {
            const notification = (0, utils_1.$el)("#GlobalNotification");
            if (!notification || !window.notification) return;
            const { text, variant, duration } = window.notification;
            notification.show(text, variant, duration);
          }
          showOverlay(key, styles) {
            (this.zIndex = styles.zIndex ?? 3),
              this.setScrollLock(),
              this.setZindexVariable(),
              this.setOverlayStyles(styles),
              this.classList.add("visible"),
              (this.isVisible = !0),
              (this.overlayCalls = [...this.overlayCalls, { key, styles }]);
          }
          async hideOverlay(key) {
            if (!this.isVisible) return;
            this.overlayCalls = this.overlayCalls.filter(
              (overlayCall) => overlayCall.key !== key
            );
            const lastCall = this.overlayCalls[this.overlayCalls.length - 1];
            lastCall
              ? this.setOverlayStyles(lastCall.styles)
              : ((this.isVisible = !1),
                this.setOverlayZindex(),
                await (0, utils_1.transitionToPromise)(this),
                this.isVisible === !1 &&
                  (this.unsetScrollLock(),
                  this.classList.remove("visible"),
                  await (0, utils_1.transitionToPromise)(this),
                  this.removeZindexVariable()));
          }
          showNotification = (text, variant, duration) => {
            (0, utils_1.$el)("#GlobalNotification").show(
              text,
              variant,
              duration
            );
          };
          setScrollLock() {
            (this.isFixed = !0),
              (this.scrollbarWidth =
                window.innerWidth - document.documentElement.clientWidth),
              this.scrollbarWidth && !isFirefox
                ? ((this.fixedTopPosition =
                    window.scrollY || this.fixedTopPosition),
                  (document.body.style.top = `-${this.fixedTopPosition}px`),
                  document.body.classList.add("scroll-y-off"))
                : (this.isOpenedOnFirefox ||
                    (document.body.style.paddingRight = `${this.scrollbarWidth}px`),
                  document.body.classList.add("scroll-y-off-firefox"),
                  (this.isOpenedOnFirefox = !0));
          }
          unsetScrollLock() {
            this.isFixed &&
              ((this.isFixed = !1),
              this.scrollbarWidth && !isFirefox
                ? ((document.body.style.top = ""),
                  document.body.classList.remove("scroll-y-off"),
                  this.fixedTopPosition &&
                    (window.scrollTo(0, this.fixedTopPosition),
                    (this.fixedTopPosition = void 0)))
                : ((document.body.style.paddingRight = ""),
                  document.body.classList.remove("scroll-y-off-firefox"),
                  (this.isOpenedOnFirefox = !1)));
          }
          setOverlayStyles(styles = {}) {
            Object.keys(styles).forEach((key) => {
              this.style[key] = styles[key];
            });
          }
          setOverlayZindex() {
            this.setAttribute("style", `z-index: ${this.zIndex};`);
          }
          setZindexVariable = () => {
            (0, dom_1.setStyleVariable)("body-overlay-zIndex", this.zIndex);
          };
          removeZindexVariable = () => {
            (0, dom_1.removeStyleVariable)("body-overlay-zIndex");
          };
          setRegistrationMessage = () => {
            const isCaptchaPage =
                window.location.pathname.includes("challenge"),
              isAccountPage = window.location.pathname.includes("account");
            !isCaptchaPage &&
              !isAccountPage &&
              localStorage.getItem("isRegistered") &&
              (0, utils_1.whenDefined)("notification-component").then(() => {
                const message = window.auroraThemeLocales.registrationMessage;
                (0, utils_1.$el)("#GlobalNotification").show(
                  message,
                  "success",
                  1e4
                ),
                  localStorage.removeItem("isRegistered");
              });
          };
        }
        exports.BodyElement = BodyElement;
      },
      8659: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.LazyVideo = void 0);
        const base_component_1 = __webpack_require__2(3608),
          INTERSECTION_OBSERVER_OPTIONS = {
            root: null,
            rootMargin: "0px 0px 200px 0px",
          };
        class LazyVideo extends base_component_1.BaseComponent {
          intersectionObserver;
          mountComponent() {
            this.addListener(window, "load", this.handleWindowLoad);
          }
          unmountComponent() {
            this.removeListener(window, "load", this.handleWindowLoad),
              this.intersectionObserver?.disconnect();
          }
          handleWindowLoad = () => {
            (this.intersectionObserver = new IntersectionObserver(
              this.handleIntersectionObserve,
              INTERSECTION_OBSERVER_OPTIONS
            )),
              this.intersectionObserver.observe(this);
          };
          handleIntersectionObserve = (entries) => {
            entries[0].isIntersecting &&
              (this.intersectionObserver.unobserve(this),
              this.intersectionObserver.disconnect(),
              this.initVideo());
          };
          initVideo = () => {
            const parentNode = this.parentNode,
              withAutoplay = this.hasAttribute("with-autoplay");
            if (!parentNode) return;
            const video = this.querySelector("video");
            video.load();
            const handleTouch = () => {
                video.paused && withAutoplay && (video.load(), video.play()),
                  this.removeListener(window, "touchstart", handleTouch);
              },
              handleCanPlay = () => {
                parentNode.replaceChild(video, this),
                  withAutoplay && video.play(),
                  this.removeListener(video, "canplaythrough", handleCanPlay);
              };
            this.addListener(video, "canplaythrough", handleCanPlay),
              this.addListener(window, "touchstart", handleTouch);
          };
        }
        exports.LazyVideo = LazyVideo;
      },
      6219: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ArticleTags = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          debounce_1 = __webpack_require__2(2731),
          COLLAPSED_TAGS_SELECTOR = "[data-collapsed-tags]",
          TAG_SELECTOR = "[data-tag]",
          EXTEND_BUTTON_SELECTOR = "[data-extend-button]";
        class ArticleTags extends base_component_1.BaseComponent {
          extendButton;
          extendButtonWidth;
          maxBottomPoint;
          resizeObserver;
          constructor() {
            super(),
              (this.extendButton = (0, utils_1.$el)(
                EXTEND_BUTTON_SELECTOR,
                this
              )),
              (this.extendButtonWidth = this.extendButton?.offsetWidth ?? 0);
          }
          mountComponent() {
            (this.resizeObserver = new ResizeObserver(
              this.handleContentResize
            )),
              this.resizeObserver.observe(this);
          }
          unmountComponent() {
            this.resizeObserver.disconnect();
          }
          handleContentResize = (0, debounce_1.debounce)(() => {
            this.update();
          }, 200);
          updateButtonVisible() {
            if (!this.extendButton) return;
            const hiddenTags = this.querySelectorAll("[tag-hidden]"),
              hasHiddenTags = hiddenTags.length > 0;
            if (hasHiddenTags) {
              const left = hiddenTags[0].style.left;
              this.extendButton.style.left = left;
            }
            this.extendButton.classList.toggle("hidden", !hasHiddenTags);
          }
          updateTagsVisible() {
            const tags = (0, utils_1.$list)(TAG_SELECTOR, this),
              isToCollapse = tags.findIndex(
                (tag) =>
                  tag.getBoundingClientRect().bottom > this.maxBottomPoint
              );
            if (isToCollapse === -1) return;
            const tagsToCollapse = tags.slice(isToCollapse - 1),
              hiddenTags = (0, utils_1.$el)(COLLAPSED_TAGS_SELECTOR, this),
              collapsedTagsFragment = document.createDocumentFragment();
            tagsToCollapse.forEach((tag) => {
              const clone = tag.cloneNode(!0);
              tag.setAttribute("tag-hidden", ""),
                collapsedTagsFragment.appendChild(clone);
            }),
              hiddenTags?.element.replaceChildren(collapsedTagsFragment);
          }
          update() {
            (this.maxBottomPoint = this.getBoundingClientRect().bottom),
              this.maxBottomPoint > 0 &&
                (this.updateTagsVisible(),
                this.updateButtonVisible(),
                this.setAttribute("visible", ""));
          }
        }
        exports.ArticleTags = ArticleTags;
      },
      8616: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ArticleTags = void 0);
        var article_tags_1 = __webpack_require__2(6219);
        Object.defineProperty(exports, "ArticleTags", {
          enumerable: !0,
          get: function () {
            return article_tags_1.ArticleTags;
          },
        });
      },
      8214: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.Card = void 0);
        const base_component_1 = __webpack_require__2(3608);
        class Card extends base_component_1.BaseComponent {}
        exports.Card = Card;
      },
      1058: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.HorizontalProductCard = void 0);
        const card_1 = __webpack_require__2(8214),
          utils_1 = __webpack_require__2(4083),
          key_1 = __webpack_require__2(9650),
          QUICK_VIEW_BUTTON_SELECTOR = "[data-product-card-quick-view-button]",
          QUICK_VIEW_SELECTOR = "#Quick-view";
        class HorizontalProductCard extends card_1.Card {
          mountComponent() {
            const quickViewBtn = (0, utils_1.$el)(
              QUICK_VIEW_BUTTON_SELECTOR,
              this
            );
            this.addListener(
              quickViewBtn,
              "keydown",
              this.handleQuickViewBtnKeyDown
            ),
              this.addListener(
                quickViewBtn,
                "click",
                this.handleQuickViewBtnClick
              ),
              this.addListener(this, "mouseenter", this.handleProductCardEnter);
          }
          handleQuickViewBtnKeyDown = async (event) => {
            (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.callQuickView(!0));
          };
          handleQuickViewBtnClick = async () => {
            this.callQuickView(!0);
          };
          handleProductCardEnter = () => {
            this.callQuickView(!1);
          };
          async callQuickView(withOpen) {
            const quickView = (0, utils_1.$el)(QUICK_VIEW_SELECTOR),
              url = this.dataset.url,
              id = this.dataset.id;
            !quickView ||
              !url ||
              !id ||
              (await quickView.requestProductFromUrl(url, id),
              withOpen &&
                (this.setQuickViewLoading(!0),
                await quickView.openAndRenderProductByUrl(url),
                this.setQuickViewLoading(!1)));
          }
          setQuickViewLoading(isLoading) {
            const quickViewBtn = (0, utils_1.$el)(
              QUICK_VIEW_BUTTON_SELECTOR,
              this
            );
            quickViewBtn &&
              (quickViewBtn.classList.toggle("loading", isLoading),
              quickViewBtn.toggleAttribute("disabled", isLoading));
          }
        }
        exports.HorizontalProductCard = HorizontalProductCard;
      },
      5705: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ColorSwatches = void 0);
        const dom_1 = __webpack_require__2(3889),
          base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          debounce_1 = __webpack_require__2(2731),
          HIDDEN_COUNT_SELECTOR = "[data-color-swatches-hidden-count]",
          LABEL_SELECTOR = "[data-color-swatches-label]",
          ITEM_SELECTOR = "[data-color-swatches-item]",
          PRODUCT_CARD_SELECTOR = "product-card";
        class ColorSwatches extends base_component_1.BaseComponent {
          productCard;
          currentVisibleImage;
          images;
          constructor() {
            super(),
              (this.productCard = (0, utils_1.$elParent)(
                PRODUCT_CARD_SELECTOR,
                this
              )),
              (this.images = (0, utils_1.$list)(
                "img[data-variant-id], [data-main-media]",
                this.productCard
              ));
          }
          mountComponent() {
            this.setOffsets(),
              this.update(),
              this.addListener(this, "mousemove", this.handleSwatchEnter),
              this.addListener(this, "mouseleave", this.handleSwatchesLeave);
          }
          handleSwatchesLeave = (0, debounce_1.debounce)(() => {
            this.images.forEach((img) => {
              this.setImageVisible(img, img.hasAttribute("data-main-media"));
            }),
              this.reset();
          }, 100);
          handleSwatchEnter = (0, debounce_1.debounce)((event) => {
            if (!this.productCard) return;
            const item = (0, utils_1.$elParent)(ITEM_SELECTOR, event.target);
            if (!item) {
              this.leave();
              return;
            }
            const variantId = item.dataset.variantId,
              image = (0, utils_1.$el)(
                `img[data-variant-id="${variantId}"]`,
                this.productCard
              ),
              color = item.dataset.color;
            !image ||
              !this.productCard.getMainMedia() ||
              !color ||
              (this.updateLabel(color),
              this.images.forEach((img) => {
                this.setImageVisible(img, img === image);
              }),
              this.setHoverStatus(!0),
              (this.currentVisibleImage = image));
          }, 10);
          leave = () => {
            this.currentVisibleImage &&
              this.setImageVisible(this.currentVisibleImage, !1),
              this.productCard.getMainMedia() &&
                this.setImageVisible(this.productCard.getMainMedia(), !0),
              this.reset();
          };
          reset = () => {
            this.setHoverStatus(!1), this.updateLabel("");
          };
          update() {
            this.updateSwatchesVisible(),
              this.updateCount(),
              this.updateDetailsInner();
          }
          updateDetailsInner() {
            const detailsInner = (0, utils_1.$elParent)(
              "[data-product-details-inner]",
              this
            );
            detailsInner &&
              detailsInner.offsetHeight < this.offsetHeight &&
              (detailsInner.style.minHeight = `${this.offsetHeight}px`);
          }
          setImageVisible(img, isVisible) {
            img.classList.toggle("product-card__img--visible", isVisible);
          }
          updateSwatchesVisible() {
            (0, utils_1.$list)(ITEM_SELECTOR, this).forEach((swatch) => {
              const rightPosition = swatch.offsetLeft + swatch.offsetWidth,
                maxWidth = this.parentNode.offsetWidth - swatch.offsetWidth,
                isHidden = rightPosition > maxWidth;
              swatch.classList.toggle("hidden-swatch", isHidden),
                swatch.setAttribute("tabindex", isHidden ? "-1" : "0");
            });
          }
          setOffsets() {
            (0, utils_1.$list)(ITEM_SELECTOR, this).forEach((swatch) => {
              swatch.style.left = `${swatch.offsetLeft}px`;
            });
          }
          updateCount() {
            const items = (0, utils_1.$list)(ITEM_SELECTOR, this),
              hiddenCount = (0, utils_1.$el)(HIDDEN_COUNT_SELECTOR, this);
            if (!hiddenCount) return;
            const hiddenCountLabel = (0, utils_1.$el)(
              "[data-color-swatches-hidden-count-label]",
              this
            );
            if (!hiddenCountLabel) return;
            const notHiddenSwatches = items.filter(
                (item) => !item.classList.contains("hidden-swatch")
              ),
              count = +(this.dataset.count || 0) - notHiddenSwatches.length;
            count > 0
              ? ((0, dom_1.showElement)(hiddenCount),
                (hiddenCountLabel.innerText = `+${count}`))
              : ((0, dom_1.hideElement)(hiddenCount),
                (hiddenCountLabel.innerText = ""));
          }
          updateLabel(color) {
            const label = (0, utils_1.$el)(LABEL_SELECTOR, this);
            label &&
              (label.innerText = color ? (0, utils_1.capitalize)(color) : "");
          }
          setHoverStatus(isHover) {
            this.productCard?.classList.toggle(
              "is-color-swatch-hover",
              isHover
            );
          }
        }
        exports.ColorSwatches = ColorSwatches;
      },
      7195: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductMediaTabs = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          PRODUCT_CARD_SELECTOR = "product-card",
          ITEM_SELECTOR = "[data-product-media-tabs-item]",
          MAIN_MEDIA_SELECTOR = "[data-main-media]";
        class ProductMediaTabs extends base_component_1.BaseComponent {
          selected = null;
          mountComponent() {
            (0, utils_1.$list)(ITEM_SELECTOR, this).forEach((tab) => {
              this.addListener(tab, "mouseenter", this.handleTabEnter),
                this.addListener(tab, "mouseleave", this.handleTabLeave);
            });
          }
          handleTabEnter = (event) => {
            const productCard = (0, utils_1.$elParent)(
                PRODUCT_CARD_SELECTOR,
                this
              ),
              tab = event.currentTarget,
              img = (0, utils_1.$el)(
                `[data-id="${tab.dataset.id}"]`,
                productCard
              );
            this.selected && this.reset(),
              this.setTabSelect(tab, !0),
              this.setImageVisible(productCard.getMainMedia(), !1),
              this.setImageVisible(img, !0),
              (this.selected = { tab, img }),
              img.tagName === "VIDEO" && img.play();
          };
          handleTabLeave = () => {
            const productCard = (0, utils_1.$elParent)(
              PRODUCT_CARD_SELECTOR,
              this
            );
            this.selected && this.reset(),
              (0, utils_1.$list)(MAIN_MEDIA_SELECTOR, productCard).forEach(
                (media) => {
                  this.setImageVisible(media, !0);
                }
              );
          };
          setTabSelect(tab, isSelected) {
            tab.classList.toggle("selected", isSelected);
          }
          setImageVisible(img, isVisible) {
            img.classList.toggle("product-card__img--visible", isVisible);
          }
          reset() {
            this.selected &&
              (this.selected.img.tagName === "VIDEO" &&
                this.selected.img.pause(),
              this.selected.img.classList.remove("product-card__img--visible"),
              this.selected.tab.classList.remove("selected"),
              (this.selected = null));
          }
        }
        exports.ProductMediaTabs = ProductMediaTabs;
      },
      6978: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductCard = void 0);
        const key_1 = __webpack_require__2(9650),
          debounce_1 = __webpack_require__2(2731),
          dom_1 = __webpack_require__2(3889),
          card_1 = __webpack_require__2(8214),
          utils_1 = __webpack_require__2(4083),
          check_media_1 = __webpack_require__2(5580),
          QUICK_VIEW_BUTTON_SELECTOR = "[data-product-card-quick-view-button]",
          PRELOADER_SELECTOR = "[data-product-card-preloader]",
          BUTTONS_SELECTOR = "[data-product-card-buttons]",
          FEATURED_MEDIA_SELECTOR = "[data-product-card-featured-image]",
          COLOR_SWATCHES_SELECTOR = "[data-product-card-color-swatches]",
          INNER_SELECTOR = "[data-product-card-inner]",
          QUICK_VIEW_SELECTOR = "#Quick-view",
          MAIN_MEDIA_SELECTOR = "[data-main-media]";
        class ProductCard extends card_1.Card {
          resizeObserver;
          buttonsWidth = 0;
          buttonsHeight = 0;
          carouselInited;
          playingVideo;
          mountComponent() {
            const quickViewBtn = (0, utils_1.$el)(
                QUICK_VIEW_BUTTON_SELECTOR,
                this
              ),
              featuredImages = (0, utils_1.$list)(
                FEATURED_MEDIA_SELECTOR,
                this
              );
            (this.resizeObserver = new ResizeObserver(this.handleResize)),
              this.resizeObserver.observe(this),
              featuredImages.forEach((featuredImage) => {
                featuredImage.complete ||
                featuredImage.readyState === 4 ||
                featuredImage.tagName === "IFRAME"
                  ? this.handleMediaLoad()
                  : (this.addListener(
                      featuredImage,
                      "load",
                      this.handleMediaLoad
                    ),
                    this.addListener(
                      featuredImage,
                      "loadeddata",
                      this.handleMediaLoad
                    ));
              }),
              this.addListener(
                quickViewBtn,
                "click",
                this.handleQuickViewBtnClick
              ),
              this.addListener(
                quickViewBtn,
                "keydown",
                this.handleQuickViewBtnKeyDown
              ),
              this.addListener(this, "mouseenter", this.handleProductCardEnter);
          }
          unmountComponent() {
            this.resizeObserver.disconnect();
          }
          handleQuickViewBtnKeyDown = async (event) => {
            (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.callQuickView(!0));
          };
          handleQuickViewBtnClick = async () => {
            this.callQuickView(!0);
          };
          handleProductCardEnter = () => {
            this.callQuickView(!1);
          };
          async callQuickView(withOpen) {
            const quickView = (0, utils_1.$el)(QUICK_VIEW_SELECTOR),
              url = this.dataset.url,
              id = this.dataset.id;
            !quickView ||
              !url ||
              !id ||
              (await quickView.requestProductFromUrl(url, id),
              withOpen &&
                (this.setQuickViewLoading(!0),
                await quickView.openAndRenderProductByUrl(url),
                this.setQuickViewLoading(!1)));
          }
          handleResize = (0, debounce_1.debounce)(() => {
            const buttons = (0, utils_1.$el)(BUTTONS_SELECTOR, this),
              swatches = (0, utils_1.$el)(COLOR_SWATCHES_SELECTOR, this);
            buttons && this.setButtonsOverflow(),
              swatches && swatches.update(),
              (0, check_media_1.isMobile)() && this.initMobileCarousel();
          }, 250);
          handleMediaLoad = () => {
            const loader = (0, utils_1.$el)(PRELOADER_SELECTOR, this);
            (0, dom_1.hideElement)(loader);
          };
          initMobileCarousel = () => {
            if (this.carouselInited) return;
            const carousel = (0, utils_1.$el)("carousel-component", this);
            if (!carousel) return;
            (0, utils_1.$el)("video", carousel) &&
              (carousel.embla?.on("select", this.handleCarouselSelect),
              (this.carouselInited = !0));
          };
          handleCarouselSelect = (0, debounce_1.debounce)((embla) => {
            this.playingVideo &&
              (this.playingVideo.pause(), (this.playingVideo = null));
            const currentSlide =
              embla.slideNodes()[embla.selectedScrollSnap()].firstElementChild;
            currentSlide.tagName === "VIDEO" &&
              (currentSlide.play(), (this.playingVideo = currentSlide));
          }, 100);
          setButtonsOverflow() {
            const buttons = (0, utils_1.$el)(BUTTONS_SELECTOR, this),
              inner = (0, utils_1.$el)(INNER_SELECTOR, this);
            if (!buttons || this.offsetWidth < this.buttonsWidth) return;
            const isWidthOverflow = buttons.offsetWidth > inner.offsetWidth,
              isHeightOverflow = buttons.offsetHeight > inner.offsetHeight;
            isWidthOverflow &&
              buttons.offsetWidth > this.buttonsWidth &&
              (this.buttonsWidth = buttons.offsetWidth),
              isHeightOverflow &&
                buttons.offsetHeight > this.buttonsHeight &&
                (this.buttonsHeight = buttons.offsetHeight),
              buttons.classList.toggle("is-width-overflowed", isWidthOverflow),
              buttons.classList.toggle(
                "is-height-overflowed",
                isHeightOverflow
              );
          }
          setQuickViewLoading(isLoading) {
            const quickViewBtn = (0, utils_1.$el)(
              QUICK_VIEW_BUTTON_SELECTOR,
              this
            );
            quickViewBtn &&
              (quickViewBtn.classList.toggle("loading", isLoading),
              quickViewBtn.toggleAttribute("disabled", isLoading));
          }
          getMainMedia() {
            return (0, utils_1.$el)(MAIN_MEDIA_SELECTOR, this);
          }
        }
        exports.ProductCard = ProductCard;
      },
      3505: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.VerticalProductCard = void 0);
        const card_1 = __webpack_require__2(8214),
          utils_1 = __webpack_require__2(4083),
          key_1 = __webpack_require__2(9650),
          QUICK_VIEW_BUTTON_SELECTOR = "[data-product-card-quick-view-button]",
          QUICK_VIEW_SELECTOR = "#Quick-view";
        class VerticalProductCard extends card_1.Card {
          mountComponent() {
            const quickViewBtn = (0, utils_1.$el)(
              QUICK_VIEW_BUTTON_SELECTOR,
              this
            );
            this.addListener(
              quickViewBtn,
              "click",
              this.handleQuickViewBtnClick
            ),
              this.addListener(
                quickViewBtn,
                "keydown",
                this.handleQuickViewBtnKeyDown
              ),
              this.addListener(this, "mouseenter", this.handleProductCardEnter);
          }
          handleQuickViewBtnKeyDown = async (event) => {
            (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.callQuickView(!0));
          };
          handleQuickViewBtnClick = async () => {
            this.callQuickView(!0);
          };
          handleProductCardEnter = () => {
            this.callQuickView(!1);
          };
          async callQuickView(withOpen) {
            const quickView = (0, utils_1.$el)(QUICK_VIEW_SELECTOR),
              url = this.dataset.url,
              id = this.dataset.id;
            !quickView ||
              !url ||
              !id ||
              (await quickView.requestProductFromUrl(url, id),
              withOpen &&
                (this.setQuickViewLoading(!0),
                await quickView.openAndRenderProductByUrl(url),
                this.setQuickViewLoading(!1)));
          }
          setQuickViewLoading(isLoading) {
            const quickViewBtn = (0, utils_1.$el)(
              QUICK_VIEW_BUTTON_SELECTOR,
              this
            );
            quickViewBtn &&
              (quickViewBtn.classList.toggle("loading", isLoading),
              quickViewBtn.toggleAttribute("disabled", isLoading));
          }
        }
        exports.VerticalProductCard = VerticalProductCard;
      },
      6470: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.seamlessAutoPlay = exports.oneAtTimeAutoPlay = void 0);
        const interval_timer_1 = __webpack_require__2(9331),
          oneAtTimeAutoPlay = (embla, interval) => {
            const next = () => {
                const lastSlideIndex = embla.scrollSnapList().length - 1;
                embla.selectedScrollSnap() === lastSlideIndex
                  ? embla.scrollTo(0)
                  : embla.scrollNext();
              },
              intervalTimer = new interval_timer_1.IntervalTimer(
                next,
                interval
              );
            return {
              play: () => {
                intervalTimer.resume();
              },
              stop: () => {
                intervalTimer.stop();
              },
              start: () => {
                intervalTimer.start();
              },
              pause: () => {
                intervalTimer.pause();
              },
            };
          };
        exports.oneAtTimeAutoPlay = oneAtTimeAutoPlay;
        const seamlessAutoPlay = (embla, interval) => {
          let tick = 0;
          const engine = embla.internalEngine(),
            distance = interval / -5,
            animate = () => {
              engine.scrollTo.distance(distance, !1),
                (tick = requestAnimationFrame(animate));
            };
          return {
            play: () => {
              tick = requestAnimationFrame(animate);
            },
            pause: () => {
              cancelAnimationFrame(tick);
            },
            stop: () => {
              cancelAnimationFrame(tick), (tick = 0);
            },
          };
        };
        exports.seamlessAutoPlay = seamlessAutoPlay;
      },
      532: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CarouselButton = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          CAROUSEL_COMPONENT_SELECTOR = "carousel-component",
          CAROUSEL_DOTS_SELECTOR = "carousel-dots",
          HIDE_INSIDE_DOTS_SELECTOR = "data-hide-inside-dots";
        class CarouselButton extends base_component_1.BaseComponent {
          snaps = [];
          mountComponent() {
            (this.snaps = [
              ...Array(this.carousel.embla.slideNodes().length).keys(),
            ]),
              this.hasAttribute(HIDE_INSIDE_DOTS_SELECTOR)
                ? this.checkIfToHideButton()
                : this.initButton();
          }
          unmountComponent() {
            this.carousel &&
              (this.carousel.embla.off("reInit", this.handleCarouselReInit),
              this.carousel.embla.off("scroll", this.handleCarouselScroll),
              this.carousel.embla.off("select", this.handleCarouselSelect));
          }
          checkIfToHideButton = () => {
            (0, utils_1.$elParent)(
              CAROUSEL_DOTS_SELECTOR,
              this
            ).embla.slidesInView().length === this.snaps.length
              ? this.hideButton(!0)
              : this.initButton();
          };
          initButton = () => {
            this.update(),
              this.addListener(this, "keydown", this.handleKeyDown),
              this.addListener(this, "click", this.handleButtonClick),
              this.carousel &&
                (this.carousel.embla.on("reInit", this.handleCarouselReInit),
                this.carousel.embla.on("select", this.handleCarouselSelect),
                this.carousel.embla.on("scroll", this.handleCarouselScroll));
          };
          handleButtonClick = (event) => {
            event.preventDefault(), this.trigger();
          };
          handleKeyDown = (event) => {
            (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.trigger());
          };
          handleCarouselReInit = () => {
            this.update();
          };
          handleCarouselSelect = () => {
            this.update();
          };
          handleCarouselScroll = () => {
            this.update();
          };
          update() {
            this.updateDisable(), this.updateVisible();
          }
          updateDisable = () => {
            const canScroll =
              this.dataset.direction === "next"
                ? this.carousel?.embla.canScrollNext()
                : this.carousel?.embla.canScrollPrev();
            this.toggleAttribute("disabled", !canScroll);
          };
          updateVisible() {
            if (!this.carousel) return;
            const slides = this.carousel.embla.slidesInView(),
              index =
                this.dataset.direction === "next" ? this.snaps.length - 1 : 0;
            this.hideButton(slides.includes(index));
          }
          hideButton = (boolean) => {
            this.toggleAttribute("has-not-slides-not-in-view", boolean);
          };
          trigger() {
            this.dataset.direction === "next"
              ? this.carousel?.embla.scrollNext()
              : this.carousel?.embla.scrollPrev(),
              this.carousel?.stop();
          }
          get carousel() {
            return (0, utils_1.$elParent)(CAROUSEL_COMPONENT_SELECTOR, this);
          }
        }
        exports.CarouselButton = CarouselButton;
      },
      4887: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CarouselDots = void 0);
        const tslib_1 = __webpack_require__2(7582),
          base_component_1 = __webpack_require__2(3608),
          embla_carousel_1 = tslib_1.__importDefault(
            __webpack_require__2(1689)
          ),
          embla_carousel_wheel_gestures_1 = __webpack_require__2(9298),
          key_1 = __webpack_require__2(9650),
          embla_carousel_class_names_1 = tslib_1.__importDefault(
            __webpack_require__2(9635)
          ),
          debounce_1 = __webpack_require__2(2731),
          utils_1 = __webpack_require__2(4083),
          CAROUSEL_SELECTOR = "carousel-component",
          CAROUSEL_DOT_SELECTOR = "[data-carousel-dot]";
        class CarouselDots extends base_component_1.BaseComponent {
          embla;
          dots;
          mountComponent() {
            this.handleCarouselInit(),
              this.carousel?.on("changePlayState", this.handleChangePlayState);
          }
          unmountComponent() {
            this.carousel?.off("changePlayState", this.handleChangePlayState),
              this.carousel?.embla.off("reInit", this.handleCarouselReInit),
              this.carousel?.embla.off("select", this.handleCarouselSelect),
              this.embla.destroy();
          }
          handleDotClick = (event) => {
            const dot = (0, utils_1.$elParent)(
              CAROUSEL_DOT_SELECTOR,
              event.target
            );
            dot && this.scrollToIndex(+dot.dataset.dotIndex);
          };
          handleKeydown = (event) => {
            if ((0, key_1.isTabKey)(event)) {
              const targets = (0, utils_1.$list)(
                  (0, utils_1.getFocusTargets)(),
                  this
                ).filter((target) => target.clientWidth > 0),
                index = targets.findIndex((target) => target === event.target),
                nextTarget = targets[index + 1],
                prevTarget = targets[index - 1];
              event.shiftKey
                ? prevTarget && this.focusScroll(prevTarget)
                : nextTarget && this.focusScroll(nextTarget);
            }
            const dot = (0, utils_1.$elParent)(
              CAROUSEL_DOT_SELECTOR,
              event.target
            );
            dot &&
              (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(),
              this.scrollToIndex(+dot.dataset.dotIndex));
          };
          handleSettle = () => {
            this.update();
          };
          handleCarouselInit = () => {
            this.setCarousel(),
              this.updateLoadAnimation(),
              this.addListener(this, "click", this.handleDotClick),
              this.addListener(this, "keydown", this.handleKeydown),
              this.carousel?.embla.on("reInit", this.handleCarouselReInit),
              this.carousel?.embla.on("select", this.handleCarouselSelect),
              this.embla.on("resize", this.handleResize),
              this.embla.on("settle", this.handleSettle),
              this.getAttribute("change-slide-on-scroll") &&
                this.embla.on("select", this.handleSelect);
          };
          handleSelect = () => {
            const selectedDotIndex = this.dots.findIndex((dot) =>
              dot.classList.contains("is-selected")
            );
            this.carousel.embla.scrollTo(selectedDotIndex);
          };
          handleCarouselReInit = () => {
            this.setCarousel();
          };
          handleResize = (0, debounce_1.debounce)(() => {
            this.update();
          }, 250);
          handleCarouselSelect = () => {
            if (!this.carousel) return;
            const index = this.carousel.embla.selectedScrollSnap();
            this.embla.scrollTo(index),
              this.dots.forEach((dot) => {
                dot.classList.toggle(
                  "is-primary",
                  +dot.dataset.dotIndex === index
                );
              });
          };
          handleChangePlayState = () => {
            this.updateLoadAnimation();
          };
          focusScroll = (target) => {
            const slideIndex = [...this.embla.slideNodes()].findIndex((slide) =>
              slide.contains(target)
            );
            slideIndex !== -1 && this.embla.scrollTo(slideIndex, !0);
          };
          updateLoadAnimation() {
            this.classList.toggle("is-autoplaying", this.carousel?.isPlay);
          }
          reInit() {
            this.embla.reInit(this.getOptions(), this.getPlugins());
          }
          scrollToIndex(index) {
            this.carousel?.embla.scrollTo(index), this.carousel?.stop();
          }
          getOptions = () => ({
            inViewThreshold: +(this.dataset.inViewThreshhold || 0) || 0.5,
            containScroll: this.getAttribute("data-contain-scroll"),
            align: this.getAttribute("data-align"),
            skipSnaps: this.hasAttribute("data-skip-snaps"),
            watchDrag: this.hasAttribute("data-draggable"),
            axis: this.getAttribute("data-axis"),
          });
          getPlugins = () => {
            const plugins = [(0, embla_carousel_class_names_1.default)()];
            return (
              this.hasAttribute("data-with-wheel-gestures") &&
                plugins.push(
                  (0, embla_carousel_wheel_gestures_1.WheelGesturesPlugin)({
                    forceWheelAxis: this.getAttribute("data-axis"),
                  })
                ),
              plugins
            );
          };
          setCarousel() {
            const viewport = (0, utils_1.$el)("[data-carousel-viewport]", this);
            viewport &&
              ((this.embla = (0, embla_carousel_1.default)(
                viewport,
                this.getOptions(),
                this.getPlugins()
              )),
              (this.dots = [...this.embla.slideNodes()]));
          }
          stop() {
            this.carousel?.stop();
          }
          update() {
            const indexList = this.dots.map((_, index) => index),
              visibleIndexList = this.embla.slidesInView();
            this.dots.forEach((dot, index) => {
              const firstVisibleIndex = visibleIndexList[0],
                lastVisibleIndex =
                  visibleIndexList[visibleIndexList.length - 1],
                firstIndex = indexList[0],
                lastIndex = indexList[indexList.length - 1],
                isLast = index === lastIndex,
                isLastVisible = index === lastVisibleIndex,
                isFirst = index === firstIndex,
                isFirstVisible = index === firstVisibleIndex;
              dot.classList.toggle(
                "is-prev-prev",
                (isFirstVisible || isLastVisible) && !isLast && !isFirst
              );
            });
          }
          get carousel() {
            return (0, utils_1.$elParent)(CAROUSEL_SELECTOR, this);
          }
        }
        exports.CarouselDots = CarouselDots;
      },
      317: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CarouselPlayButton = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          BUTTON_SELECTOR = "[data-carousel-play-button]",
          CAROUSEL_SELECTOR = "carousel-component";
        class CarouselPlayButton extends base_component_1.BaseComponent {
          mountComponent() {
            this.update(),
              this.addListener(this, "click", this.handleButtonClick),
              this.carousel &&
                (customElements.upgrade(this.carousel),
                (0, utils_1.whenDefined)("carousel-component").then(() => {
                  this.carousel?.on(
                    "changePlayState",
                    this.handleChangePlayState
                  );
                }));
          }
          unmountComponent() {
            this.carousel &&
              (0, utils_1.whenDefined)("carousel-component").then(() => {
                this.carousel?.off(
                  "changePlayState",
                  this.handleChangePlayState
                );
              });
          }
          handleChangePlayState = () => {
            this.update();
          };
          handleButtonClick = (event) => {
            event.stopPropagation(),
              this.carousel &&
                (this.carousel.isPlay
                  ? this.carousel.stop()
                  : this.carousel.play(),
                this.resetAnimation());
          };
          update() {
            const button = (0, utils_1.$el)(BUTTON_SELECTOR, this);
            !this.carousel ||
              !button ||
              button.toggleAttribute(
                "data-autoplay-stopped",
                !this.carousel.isPlay
              );
          }
          resetAnimation() {
            this.carousel.classList.toggle(
              "is-reset-autoplay-loader-animation",
              !this.carousel.isPlay
            );
          }
          get carousel() {
            return (0, utils_1.$elParent)(CAROUSEL_SELECTOR, this);
          }
        }
        exports.CarouselPlayButton = CarouselPlayButton;
      },
      319: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CarouselProgress = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          CAROUSEL_COMPONENT = "carousel-component",
          INDICATOR_SELECTOR = "[data-carousel-progress-indicator]";
        class CarouselProgress extends base_component_1.BaseComponent {
          targetEvent;
          carousel;
          constructor() {
            super(),
              (this.targetEvent =
                this.dataset.target === "scroll" ? "scroll" : "settle");
          }
          mountComponent() {
            (this.carousel = (0, utils_1.$elParent)(CAROUSEL_COMPONENT, this)),
              this.update(),
              this.carousel?.embla.on(this.targetEvent, this.handleProgress),
              this.carousel?.embla.on("reInit", this.handleCarouselReInit);
          }
          unmountComponent() {
            this.carousel?.embla.off(this.targetEvent, this.handleProgress),
              this.carousel?.embla.off("reInit", this.handleCarouselReInit);
          }
          handleProgress = () => {
            this.update();
          };
          handleCarouselReInit = () => {
            this.update();
          };
          update() {
            const indicator = (0, utils_1.$el)(INDICATOR_SELECTOR, this);
            indicator &&
              (indicator.style.transform =
                this.dataset.axis === "vertical"
                  ? `translate3d(0, ${this.getProgress()}%, 0)`
                  : `translate3d(${this.getProgress()}%, 0, 0)`);
          }
          getProgress() {
            return this.dataset.target === "scroll"
              ? this.getProgressByScroll()
              : this.getProgressBySlideInView();
          }
          getProgressBySlideInView() {
            if (!this.carousel) return 0;
            const slideCount = this.carousel.embla.slideNodes().length,
              visibleSlides = this.carousel.embla.slidesInView(),
              lastVisibleSlide = visibleSlides[visibleSlides.length - 1] + 1,
              progressPerSlide = 100 / slideCount;
            return Math.ceil(progressPerSlide * lastVisibleSlide);
          }
          getProgressByScroll() {
            return this.carousel
              ? Math.max(0, Math.min(1, this.carousel.embla.scrollProgress())) *
                  100
              : 0;
          }
        }
        exports.CarouselProgress = CarouselProgress;
      },
      3442: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CarouselComponent = void 0);
        const tslib_1 = __webpack_require__2(7582),
          embla_carousel_wheel_gestures_1 = __webpack_require__2(9298),
          base_component_1 = __webpack_require__2(3608),
          embla_carousel_1 = tslib_1.__importDefault(
            __webpack_require__2(1689)
          ),
          embla_carousel_class_names_1 = tslib_1.__importDefault(
            __webpack_require__2(9635)
          ),
          utils_1 = __webpack_require__2(4083),
          key_1 = __webpack_require__2(9650),
          carousel_autoplay_1 = __webpack_require__2(6470),
          check_media_1 = __webpack_require__2(5580);
        class CarouselComponent extends base_component_1.BaseComponent {
          withSimpleAutoplay;
          withSeamlessAutoplay;
          withAutoplay;
          withFade;
          isTouching;
          isPlay;
          lastIsMobile;
          autoplay;
          embla;
          resizeObserver;
          constructor() {
            super(),
              (this.withSimpleAutoplay =
                this.dataset.autoplayMode === "one_at_time"),
              (this.withSeamlessAutoplay =
                this.dataset.autoplayMode === "seamless"),
              (this.withAutoplay =
                this.withSimpleAutoplay || this.withSeamlessAutoplay),
              (this.withFade = this.dataset.animation === "fade");
          }
          mountComponent() {
            this.setCarousel(),
              this.setAutoplay(),
              this.addListener(this, "keydown", this.handleKeydown),
              this.embla.on("select", this.handleCarouselSelect),
              this.embla.on("scroll", this.handleCarouselScroll),
              this.embla.on("pointerUp", this.handleCarouselPointerUp),
              this.embla.on("pointerDown", this.handleCarouselPointerDown),
              this.withFade
                ? (this.embla.on("init", this.initFade),
                  this.embla.on("resize", this.resizeFade),
                  this.embla.on("reInit", this.initFade),
                  this.embla.internalEngine().translate.toggleActive(!1))
                : document.fonts.ready.then(() => {
                    this.reInit();
                  }),
              this.hasAttribute("with-hover-pause") &&
                this.isPlay &&
                (this.addListener(this, "mouseenter", this.handleCarouselEnter),
                this.addListener(this, "mouseleave", this.handleCarouselLeave)),
              this.isEditor &&
                ((this.resizeObserver = new ResizeObserver(
                  this.handleCarouselResize
                )),
                this.resizeObserver.observe(this),
                this.editor.on("BLOCK_SELECT", this.handleBlockSelect),
                this.editor.on("SECTION_LOAD", this.handleSectionLoad));
          }
          unmountComponent() {
            this.embla.destroy(),
              this.isEditor && this.resizeObserver.disconnect();
          }
          handleKeydown = (event) => {
            if ((this.stop(), (0, key_1.isTabKey)(event))) {
              const targets = (0, utils_1.$list)(
                  (0, utils_1.getFocusTargets)(),
                  this
                ).filter((target) => target.clientWidth > 0),
                index = targets.findIndex((target) => target === event.target),
                nextTarget = targets[index + 1],
                prevTarget = targets[index - 1];
              event.shiftKey
                ? prevTarget && this.focusScroll(prevTarget)
                : nextTarget && this.focusScroll(nextTarget);
            }
            (0, key_1.isLeftKey)(event) && this.embla.scrollPrev(),
              (0, key_1.isRightKey)(event) && this.embla.scrollNext();
          };
          handleCarouselResize = () => {
            this.lastIsMobile !== (0, check_media_1.isMobile)() &&
              !this.isPlay &&
              this.play(),
              (this.lastIsMobile = (0, check_media_1.isMobile)());
          };
          focusScroll = (target) => {
            const slides = [...this.embla.slideNodes()],
              slideIndex = slides.findIndex((slide) => slide.contains(target));
            if (slideIndex === -1) return;
            const slidesInOneScroll = Math.floor(
                slides.length / this.embla.scrollSnapList().length
              ),
              snapIndex = Math.floor(slideIndex / slidesInOneScroll);
            this.embla.scrollTo(snapIndex, !0);
          };
          handleCarouselEnter = () => {
            (0, check_media_1.isMobile)() ||
              (this.isPlay === !0 && this.autoplay?.pause());
          };
          handleCarouselLeave = () => {
            (0, check_media_1.isMobile)() ||
              (this.isPlay === !0 && this.autoplay?.play());
          };
          handleCarouselSelect = () => {
            (this.dataset.startIndex = `${this.embla.selectedScrollSnap()}`),
              this.emit("carouselSelect", {});
          };
          handleCarouselScroll = () => {
            this.isTouching && this.stop(), this.emit("carouselSelect", {});
          };
          handleCarouselPointerUp = () => {
            this.isTouching = !1;
          };
          handleCarouselPointerDown = () => {
            this.isTouching = !0;
          };
          handleBlockSelect = ({ detail: { sectionId, blockId, load } }) => {
            if (this.dataset.sectionId !== sectionId) return;
            const slideIndex = this.embla
              .slideNodes()
              .findIndex(
                ({ attributes }) => attributes["block-id"]?.value === blockId
              );
            slideIndex !== -1 &&
              (this.embla.scrollTo(slideIndex, load), this.stop());
          };
          handleSectionLoad = ({ detail: { sectionId } }) => {
            this.dataset.sectionId === sectionId &&
              (this.stop(),
              this.withAutoplay && this.setAutoplay(),
              this.reInit());
          };
          getOptions = () => ({
            loop: this.hasAttribute("data-loop"),
            dragFree: this.hasAttribute("data-drag-free"),
            watchDrag: this.hasAttribute("data-draggable"),
            skipSnaps: this.hasAttribute("data-skip-snaps"),
            align: this.getAttribute("data-align"),
            containScroll: this.getAttribute("data-contain-scroll"),
            inViewThreshold: +(this.dataset.inViewThreshhold || 0) || 0.75,
            axis: this.getAttribute("data-axis"),
            breakpoints: this.hasAttribute("data-breakpoints")
              ? JSON.parse(this.dataset.breakpoints)
              : void 0,
            slidesToScroll: +(this.getAttribute("data-slides-to-scroll") ?? 1),
            startIndex: this.hasAttribute("data-start-index")
              ? Number(this.dataset.startIndex)
              : 0,
            direction: this.hasAttribute("data-direction-rtl") ? "rtl" : "ltr",
          });
          getPlugins = () => {
            const plugins = [(0, embla_carousel_class_names_1.default)()];
            return (
              this.hasAttribute("data-with-wheel-gestures") &&
                plugins.push(
                  (0, embla_carousel_wheel_gestures_1.WheelGesturesPlugin)({
                    forceWheelAxis: this.getAttribute("data-axis"),
                  })
                ),
              plugins
            );
          };
          setCarousel() {
            const viewport = (0, utils_1.$el)("[data-carousel-viewport]", this);
            viewport &&
              (this.embla = (0, embla_carousel_1.default)(
                viewport,
                this.getOptions(),
                this.getPlugins()
              ));
          }
          setAutoplay() {
            if (this.autoplay) return;
            const autoplayInterval = +(this.dataset.autoplayInterval || 0);
            (this.isPlay = autoplayInterval > 0),
              this.withSimpleAutoplay &&
                ((this.autoplay = (0, carousel_autoplay_1.oneAtTimeAutoPlay)(
                  this.embla,
                  autoplayInterval * 1e3
                )),
                this.autoplay.start()),
              this.withSeamlessAutoplay &&
                ((this.autoplay = (0, carousel_autoplay_1.seamlessAutoPlay)(
                  this.embla,
                  autoplayInterval
                )),
                this.autoplay.play());
          }
          stop() {
            this.withAutoplay &&
              (this.autoplay?.stop(),
              (this.isPlay = !1),
              this.emit("changePlayState", {}));
          }
          play() {
            this.withAutoplay &&
              (this.withSimpleAutoplay && this.autoplay.start(),
              this.withSeamlessAutoplay && this.autoplay.play(),
              (this.isPlay = !0),
              this.emit("changePlayState", {}));
          }
          resizeFade = () => {
            this.classList.remove("carousel--with-fade"), this.reInit();
          };
          initFade = () => {
            const height = this.embla
              .slideNodes()[0]
              .getBoundingClientRect().height;
            this.setAttribute("style", `--gsc-fade-height: ${height}px`),
              this.classList.add("carousel--with-fade");
          };
          reInit = (options = {}) => {
            this.embla.reInit(
              { ...this.getOptions(), ...options },
              this.getPlugins()
            );
          };
        }
        exports.CarouselComponent = CarouselComponent;
      },
      9691: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CarouselProgress =
            exports.CarouselPlayButton =
            exports.CarouselDots =
            exports.CarouselButton =
            exports.CarouselComponent =
              void 0);
        var carousel_1 = __webpack_require__2(3442);
        Object.defineProperty(exports, "CarouselComponent", {
          enumerable: !0,
          get: function () {
            return carousel_1.CarouselComponent;
          },
        });
        var carousel_button_1 = __webpack_require__2(532);
        Object.defineProperty(exports, "CarouselButton", {
          enumerable: !0,
          get: function () {
            return carousel_button_1.CarouselButton;
          },
        });
        var carousel_dots_1 = __webpack_require__2(4887);
        Object.defineProperty(exports, "CarouselDots", {
          enumerable: !0,
          get: function () {
            return carousel_dots_1.CarouselDots;
          },
        });
        var carousel_play_button_1 = __webpack_require__2(317);
        Object.defineProperty(exports, "CarouselPlayButton", {
          enumerable: !0,
          get: function () {
            return carousel_play_button_1.CarouselPlayButton;
          },
        });
        var carousel_progress_bar_1 = __webpack_require__2(319);
        Object.defineProperty(exports, "CarouselProgress", {
          enumerable: !0,
          get: function () {
            return carousel_progress_bar_1.CarouselProgress;
          },
        });
      },
      7300: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SliderGrid = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          debounce_1 = __webpack_require__2(2731),
          check_media_1 = __webpack_require__2(5580),
          key_1 = __webpack_require__2(9650),
          CART_DRAWER_SELECTOR = "cart-drawer",
          TRACK_SELECTOR = "[slider-grid-track]",
          SLIDE_SELECTOR = "slider-grid-slide",
          AUTOPLAY_ATTRIBUTE = "autoplay-mode",
          AUTOPLAY_INTERVAL_ATTRIBUTE = "autoplay-interval",
          ONE_AT_TIME_AUTOPLAY_RUNNING_ATTRIBUTE = "autoplay-running",
          SEAMLESS_AUTOPLAY_RUNNING_ATTRIBUTE = "seamless-autoplay-running",
          SEAMLESS_AUTOPLAY_PAUSED_ATTRIBUTE = "seamless-autoplay-paused",
          BUTTON_SELECTOR = "button[data-direction]",
          BUTTON_DIRECTION_SELECTOR = "data-direction",
          PROGRESS_BAR_SELECTOR = "[slider-grid-progress]",
          DOT_SELECTOR = "[slider-grid-dot]",
          DESKTOP_DISABLED_ATTRIBUTE = "desktop-disabled",
          MOBILE_DISABLED_ATTRIBUTE = "mobile-disabled";
        class SliderGrid extends base_component_1.BaseComponent {
          activeSlide;
          lastSlideIndex;
          track;
          trackWidth;
          navButtons;
          buttonsInited;
          withProgressBar;
          dots;
          slides;
          withDots;
          snaps;
          x;
          y;
          autoplay;
          requestFrameId;
          seamlessRunning;
          pausedAt;
          resizeObserver;
          intersectionObserver;
          autoplayIntersectionObserver;
          autoplayForcedStopped;
          isMobile;
          desktopDisabled;
          mobileDisabled;
          forceDeactivated;
          sidebar;
          isFocused;
          constructor() {
            super(),
              (this.activeSlide = 0),
              (this.autoplay = this.getAttribute(AUTOPLAY_ATTRIBUTE)),
              (this.desktopDisabled = this.hasAttribute(
                DESKTOP_DISABLED_ATTRIBUTE
              )),
              (this.mobileDisabled = this.hasAttribute(
                MOBILE_DISABLED_ATTRIBUTE
              )),
              (this.sidebar = this.closest(CART_DRAWER_SELECTOR));
          }
          mountComponent() {
            (this.track = (0, utils_1.$el)(TRACK_SELECTOR, this)),
              (this.resizeObserver = new ResizeObserver(this.handleResize)),
              this.resizeObserver.observe(this);
          }
          unmountComponent() {
            this.stopAutoplay(),
              this.resizeObserver.disconnect(),
              this.intersectionObserver?.disconnect(),
              this.autoplayIntersectionObserver?.disconnect();
          }
          init = () => {
            if (
              ((this.isMobile = (0, check_media_1.isMobile)()),
              (this.forceDeactivated = !1),
              (this.isMobile && this.mobileDisabled) ||
                (!this.isMobile && this.desktopDisabled))
            ) {
              this.toggleListeners(!1), this.stopAutoplay();
              return;
            }
            (this.activeSlide = 0),
              this.setSnaps(),
              this.forceDeactivated
                ? (this.toggleListeners(!1), this.setButtonsInactive())
                : (this.initButtons(),
                  this.toggleButtonsActive(),
                  this.initProgressBar(),
                  this.initDots(),
                  this.initAutoplay(),
                  this.toggleListeners(!0));
          };
          handleResize = (0, debounce_1.debounce)(async () => {
            this.track.removeAttribute("style"),
              this.stopAutoplay(),
              await (0, utils_1.transitionToPromise)(this.track),
              this.init();
          }, 50);
          setSnaps = () => {
            const slides = (0, utils_1.$list)(`[${SLIDE_SELECTOR}]`, this),
              viewportWidth = this.track.getBoundingClientRect().width + 1,
              { left: firstSlideLeft, width: slideWidth } =
                slides[0].getBoundingClientRect(),
              lastSlideRight =
                slides[slides.length - 1].getBoundingClientRect().right,
              slidesPerView = Math.floor(viewportWidth / slideWidth),
              snapsCount = slides.length - slidesPerView;
            if (snapsCount < 1) {
              this.forceDeactivated = !0;
              return;
            }
            (this.snaps = slides.reduce((acc, slide, index) => {
              if (
                index === snapsCount ||
                (index < snapsCount && index % slidesPerView === 0)
              ) {
                let snapPosition =
                  firstSlideLeft - slide.getBoundingClientRect().left;
                return (
                  index === snapsCount &&
                    snapPosition < viewportWidth &&
                    (snapPosition = this.isMobile
                      ? -(lastSlideRight - viewportWidth + firstSlideLeft)
                      : -(lastSlideRight - viewportWidth - firstSlideLeft)),
                  [...acc, snapPosition]
                );
              } else return acc;
            }, [])),
              (this.lastSlideIndex = this.snaps.length - 1),
              (this.trackWidth = firstSlideLeft + lastSlideRight);
          };
          toggleListeners = (enable) => {
            enable
              ? (this.addListener(this, "mousedown", this.handleMouseDown),
                this.addListener(this, "mouseup", this.handleMouseUp),
                this.addListener(this, "dragstart", this.handleDragStart),
                this.addListener(this, "keydown", this.handleKeydown))
              : (this.removeListener(this, "mousedown", this.handleMouseDown),
                this.removeListener(this, "mouseup", this.handleMouseUp),
                this.removeListener(this, "dragstart", this.handleDragStart),
                this.removeListener(this, "keydown", this.handleKeydown),
                this.removeListener(this, "focusin", this.handleFocus));
          };
          handleKeydown = (event) => {
            if (!this.isFocused) {
              this.stopAutoplay();
              const { lastTarget } = (0, utils_1.getTargets)(this, !1);
              this.addListener(lastTarget, "focusout", this.handleFocusOut),
                this.addListener(this, "focusin", this.handleFocus);
            }
            (0, key_1.isLeftKey)(event) && this.scrollPrev(),
              (0, key_1.isRightKey)(event) && this.scrollNext(),
              (this.isFocused = !0);
          };
          handleFocus = (event) => {
            const targetLeft = event.target.getBoundingClientRect().left,
              thisRight = this.getBoundingClientRect().right;
            targetLeft > thisRight && this.scrollNext(),
              targetLeft < 0 && (this.scrollTo(0), (this.activeSlide = 0)),
              this.toggleButtonsActive();
          };
          handleFocusOut = ({ currentTarget }) => {
            this.removeListener(currentTarget, "focusout", this.handleFocusOut),
              this.removeListener(this, "focusin", this.handleFocus);
          };
          handleMouseDown = ({ x }) => {
            this.addListener(this, "mousemove", this.handleMouseMove),
              (this.x = x),
              this.stopAutoplay();
          };
          handleMouseUp = ({ x }) => {
            this.isSwipeRight(x) && this.scrollNext(),
              this.isSwipeLeft(x) && this.scrollPrev(),
              this.classList.remove("dragging"),
              this.removeListener(this, "mousemove", this.handleMouseMove);
          };
          handleMouseMove = ({ x }) => {
            (this.isSwipeRight(x) || this.isSwipeLeft(x)) &&
              this.classList.add("dragging");
          };
          handleDragStart = (event) => (event.preventDefault(), !1);
          handleTouchStart = () => {
            const translated = this.track
              .getAttribute("style")
              ?.replace("transform: translateX(", "")
              .replace("px);", "");
            this.stopAutoplay(),
              this.track.removeAttribute("style"),
              this.track.scrollTo({ left: Math.abs(+translated) }),
              (this.autoplayForcedStopped = !0);
          };
          isSwipeRight = (x) => this.x - x > 0;
          isSwipeLeft = (x) => this.x - x < 0;
          handleMouseEnterAutoplay = () => {
            this.pauseAutoplay();
          };
          handleMouseLeaveAutoplay = () => {
            this.startAutoplay();
          };
          scrollNext = () => {
            if (!this.canScrollNext()) return;
            const nextIndex = this.activeSlide + 1;
            (this.activeSlide = nextIndex),
              this.scrollTo(this.snaps[nextIndex]);
          };
          scrollPrev = () => {
            if (!this.canScrollPrev()) return;
            const nextIndex = this.activeSlide < 1 ? 0 : this.activeSlide - 1;
            (this.activeSlide = nextIndex),
              this.scrollTo(this.snaps[nextIndex]),
              this.seamlessRunning && (this.seamlessRunning = !1);
          };
          scrollTo = (value) => {
            this.track.setAttribute(
              "style",
              `transform: translateX(${value}px);`
            ),
              this.toggleNavItems();
          };
          canScrollNext = () => this.activeSlide !== this.lastSlideIndex;
          canScrollPrev = () => this.seamlessRunning || this.activeSlide !== 0;
          scrollSlideIntoView = (slideIndex) => {
            if (slideIndex !== this.activeSlide) {
              if (this.isMobile)
                this.track.scrollTo({
                  left: Math.abs(this.snaps[slideIndex]),
                  behavior: "smooth",
                }),
                  (this.activeSlide = slideIndex);
              else {
                const slideLeft = (0, utils_1.$list)(
                    `[${SLIDE_SELECTOR}]`,
                    this
                  )[slideIndex].getBoundingClientRect().left,
                  trackLeft = this.track.getBoundingClientRect().left,
                  snapToScroll =
                    slideIndex === 0
                      ? 0
                      : slideIndex > this.lastSlideIndex
                      ? this.lastSlideIndex
                      : this.snaps.findIndex(
                          (snap) => slideLeft - trackLeft + snap < 10
                        );
                this.scrollTo(this.snaps[snapToScroll]),
                  (this.activeSlide = snapToScroll);
              }
              this.toggleNavItems();
            }
          };
          toggleNavItems = () => {
            this.toggleButtonsActive(),
              this.withProgressBar && this.setProgress(),
              this.withDots && this.toggleDotsActive(this.activeSlide);
          };
          initAutoplay = () => {
            this.autoplay &&
              (this.isMobile &&
                this.addListener(this, "touchstart", this.handleTouchStart),
              this.addListener(
                this,
                "mouseenter",
                this.handleMouseEnterAutoplay
              ),
              this.addListener(
                this,
                "mouseleave",
                this.handleMouseLeaveAutoplay
              ),
              (this.autoplayIntersectionObserver = new IntersectionObserver(
                this.toggleAutoplayOnIntersection
              )),
              this.autoplayIntersectionObserver.observe(this));
          };
          toggleAutoplayOnIntersection = (elements) => {
            elements[0].isIntersecting
              ? this.startAutoplay()
              : (this.pauseAutoplay(),
                this.autoplayForcedStopped &&
                  this.autoplayIntersectionObserver.disconnect());
          };
          startAutoplay = () => {
            this.autoplay === "one_at_time"
              ? this.startOneAtTimeAutoPlay()
              : this.autoplay === "seamless" &&
                (this.startSeamlessAutoPlay(), this.toggleButtonsActive());
          };
          stopAutoplay = () => {
            this.removeAutoplayState(),
              this.removeListener(this, "touchstart", this.handleTouchStart),
              this.removeListener(
                this,
                "mouseenter",
                this.handleMouseEnterAutoplay
              ),
              this.removeListener(
                this,
                "mouseleave",
                this.handleMouseLeaveAutoplay
              );
          };
          pauseAutoplay = () => {
            this.removeAutoplayState(),
              this.autoplay === "seamless" &&
                (this.pausedAt = +this.track.style.transform
                  .replace("translateX(", "")
                  .replace("px)", ""));
          };
          removeAutoplayState = () => {
            cancelAnimationFrame(this.requestFrameId),
              this.removeAttribute(ONE_AT_TIME_AUTOPLAY_RUNNING_ATTRIBUTE),
              this.removeAttribute(SEAMLESS_AUTOPLAY_RUNNING_ATTRIBUTE);
          };
          startOneAtTimeAutoPlay = async () => {
            this.sidebar &&
              (await (0, utils_1.transitionToPromise)(this.sidebar),
              this.setSnaps()),
              this.removeAttribute(ONE_AT_TIME_AUTOPLAY_RUNNING_ATTRIBUTE);
            const interval =
              +this.getAttribute(AUTOPLAY_INTERVAL_ATTRIBUTE) * 1e3;
            let last;
            const tick = (timestamp) => {
              last || (last = timestamp),
                timestamp - last > interval &&
                  (this.canScrollNext()
                    ? this.scrollNext()
                    : ((this.activeSlide = -1), this.scrollNext()),
                  (last = timestamp)),
                (this.requestFrameId = requestAnimationFrame(tick));
            };
            (this.requestFrameId = requestAnimationFrame(tick)),
              this.setAttribute(ONE_AT_TIME_AUTOPLAY_RUNNING_ATTRIBUTE, "");
          };
          startSeamlessAutoPlay = async () => {
            this.sidebar &&
              (await (0, utils_1.transitionToPromise)(this.sidebar),
              this.setSnaps()),
              this.setAttribute(SEAMLESS_AUTOPLAY_RUNNING_ATTRIBUTE, "");
            const distance = this.snaps[this.snaps.length - 1],
              interval = 0.2 * +this.getAttribute(AUTOPLAY_INTERVAL_ATTRIBUTE);
            let scrolled = this.pausedAt ?? 0;
            const tick = () => {
              if (
                ((scrolled = Math.max(scrolled - interval, distance)),
                this.scrollTo(scrolled),
                scrolled != distance)
              ) {
                this.requestFrameId = requestAnimationFrame(tick);
                const currentSnap = this.snaps.findIndex((val) => {
                  const diff = scrolled - val;
                  return diff > 0 && diff < 20;
                });
                currentSnap > 0 && (this.activeSlide = currentSnap),
                  this.withProgressBar &&
                    this.setProgress(Math.abs(scrolled / distance) * 100);
              } else this.restartSeamlessAutoplay();
            };
            (this.requestFrameId = requestAnimationFrame(tick)),
              (this.seamlessRunning = !0),
              (this.pausedAt = 0);
          };
          restartSeamlessAutoplay = async () => {
            this.setAttribute(SEAMLESS_AUTOPLAY_PAUSED_ATTRIBUTE, ""),
              await (0, utils_1.transitionToPromise)(this.track),
              this.isMobile ||
                this.removeAttribute(SEAMLESS_AUTOPLAY_RUNNING_ATTRIBUTE),
              cancelAnimationFrame(this.requestFrameId),
              this.track.removeAttribute("style"),
              this.withProgressBar && this.setProgress(0),
              await (0, utils_1.transitionToPromise)(this.track),
              this.removeAttribute(SEAMLESS_AUTOPLAY_PAUSED_ATTRIBUTE),
              await (0, utils_1.delay)(500),
              (this.pausedAt = 0),
              (this.activeSlide = 0),
              this.startSeamlessAutoPlay();
          };
          initButtons = () => {
            this.buttonsInited &&
              this.navButtons.forEach((btn) => {
                this.removeListener(btn, "click", this.handleButtonClick);
              }),
              (this.navButtons = (0, utils_1.$list)(BUTTON_SELECTOR, this)),
              this.navButtons.length &&
                (this.navButtons.forEach((btn) => {
                  this.addListener(btn, "click", this.handleButtonClick);
                }),
                (this.buttonsInited = !0));
          };
          handleButtonClick = ({ currentTarget }) => {
            currentTarget.getAttribute(BUTTON_DIRECTION_SELECTOR) === "next"
              ? this.scrollNext()
              : this.scrollPrev();
          };
          toggleButtonsActive = () => {
            this.buttonsInited &&
              (this.navButtons[0].toggleAttribute(
                "disabled",
                !this.canScrollPrev()
              ),
              this.navButtons[1].toggleAttribute(
                "disabled",
                !this.canScrollNext()
              ));
          };
          setButtonsInactive = () => {
            (0, utils_1.$list)(BUTTON_SELECTOR, this).forEach((btn) => {
              btn.setAttribute("disabled", "");
            });
          };
          initProgressBar = () => {
            if (this.withProgressBar) {
              this.setProgress(0);
              return;
            }
            (0, utils_1.$el)(PROGRESS_BAR_SELECTOR, this) &&
              (this.setProgress(),
              (this.withProgressBar = !0),
              this.isMobile &&
                this.addListener(
                  this.track,
                  "scroll",
                  this.handleProgressOnMobile
                ));
          };
          setProgress = (value) => {
            const progress =
              value ?? (this.activeSlide / this.lastSlideIndex) * 100;
            this.setAttribute(
              "style",
              `--gsc-slider-grid-progress: ${progress}%;`
            );
          };
          handleProgressOnMobile = ({ target }) => {
            this.setProgress((target.scrollLeft / this.trackWidth) * 100);
          };
          initDots = () => {
            this.withDots &&
              (this.intersectionObserver?.disconnect(),
              this.removeListener(
                this.dots[0].parentElement,
                "click",
                this.handleDotTouch
              )),
              this.isMobile
                ? this.initMobileDots()
                : (this.withDots &&
                    this.track.scrollTo({ left: 0, behavior: "smooth" }),
                  this.initDesktopDots()),
              this.toggleDotsActive(0);
          };
          initMobileDots = () => {
            (this.dots = (0, utils_1.$list)(DOT_SELECTOR, this).filter(
              (dot) => dot.offsetWidth > 0
            )),
              this.dots.length > 0 &&
                ((this.slides = (0, utils_1.$list)(
                  `[${SLIDE_SELECTOR}]`,
                  this
                )),
                this.addListener(
                  this.dots[0].parentElement,
                  "click",
                  this.handleDotTouch
                ),
                (this.intersectionObserver = new IntersectionObserver(
                  this.observeSlides,
                  { rootMargin: "0px", root: this }
                )),
                this.slides.forEach((slide) => {
                  this.intersectionObserver.observe(slide);
                }),
                (this.withDots = !0));
          };
          initDesktopDots = () => {
            (this.dots = (0, utils_1.$list)(DOT_SELECTOR, this).filter(
              (dot) => dot.offsetWidth > 0
            )),
              this.dots.length > 0 &&
                (this.addListener(
                  this.dots[0].parentElement,
                  "click",
                  this.handleDotTouch
                ),
                (this.withDots = !0));
          };
          observeSlides = (0, debounce_1.debounce)((entries) => {
            this.isMobile &&
              entries.forEach((entry) => {
                entry.isIntersecting &&
                  this.toggleDotsActive(+entry.target.getAttribute("index"));
              });
          }, 50);
          handleDotTouch = ({ target }) => {
            const dotClicked = target.closest(DOT_SELECTOR);
            this.isMobile
              ? this.track.scrollTo({
                  left: Math.abs(this.snaps[+dotClicked.getAttribute("index")]),
                  behavior: "smooth",
                })
              : ((this.activeSlide = +dotClicked.getAttribute("index")),
                this.scrollTo(this.snaps[this.activeSlide]),
                this.toggleDotsActive(this.activeSlide),
                this.toggleButtonsActive());
          };
          toggleDotsActive = (index) => {
            this.dots?.forEach((dot) =>
              dot.classList.toggle(
                "is-primary",
                +dot.getAttribute("index") === index
              )
            );
          };
        }
        exports.SliderGrid = SliderGrid;
      },
      8078: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartCount = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          CART_PAGE_SELECTOR = "cart-page",
          CART_DRAWER_SELECTOR = "cart-drawer",
          CART_POPUP_SELECTOR = "cart-notification-popup",
          NEW_COUNT_SELECTOR = "#NewCartCount";
        class CartCount extends base_component_1.BaseComponent {
          mountComponent() {
            const cart = (0, utils_1.$el)(CART_PAGE_SELECTOR),
              cartDrawer = (0, utils_1.$el)(CART_DRAWER_SELECTOR),
              cartPopup = (0, utils_1.$el)(CART_POPUP_SELECTOR);
            cart?.on("update-nodes", this.handleCartUpdate),
              cartDrawer?.on("update-nodes", this.handleCartUpdate),
              cartPopup?.on("update-nodes", this.handleCartUpdate);
          }
          unmountComponent() {
            const cart = (0, utils_1.$el)(CART_PAGE_SELECTOR),
              cartDrawer = (0, utils_1.$el)(CART_DRAWER_SELECTOR),
              cartPopup = (0, utils_1.$el)(CART_POPUP_SELECTOR);
            cart?.off("update-nodes", this.handleCartUpdate),
              cartDrawer?.off("update-nodes", this.handleCartUpdate),
              cartPopup?.off("update-nodes", this.handleCartUpdate);
          }
          handleCartUpdate = ({ node }) => {
            const newNode = (0, utils_1.$el)(NEW_COUNT_SELECTOR, node);
            (0, dom_1.replaceNodeChildren)(this, newNode);
          };
        }
        exports.CartCount = CartCount;
      },
      3492: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartCount = void 0);
        var cart_count_1 = __webpack_require__2(8078);
        Object.defineProperty(exports, "CartCount", {
          enumerable: !0,
          get: function () {
            return cart_count_1.CartCount;
          },
        });
      },
      5237: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartNotificationPopup = void 0);
        const modal_1 = __webpack_require__2(1181),
          utils_1 = __webpack_require__2(4083),
          dom_1 = __webpack_require__2(3889),
          check_media_1 = __webpack_require__2(5580),
          HEADER_SELECTOR = "header-component",
          HEADER_WITH_POPUP_CLASS = "shopify-section-header--with-cart-popup";
        class CartNotificationPopup extends modal_1.ModalComponent {
          wasHeaderHidden;
          purchaseHandler(html, parsedState) {
            const header = (0, utils_1.$el)(HEADER_SELECTOR);
            if (((this.wasHeaderHidden = header.isHidden), this.element)) {
              const newNode = (0, utils_1.$el)(
                  `#CartNotificationPopupItem-${parsedState.id}`,
                  html
                ),
                node = (0, utils_1.$el)(
                  "[data-cart-notification-popup]",
                  this.element
                );
              (0, dom_1.replaceNodeChildren)(node, newNode),
                this.toggleMobileHeader(!1).then(() => {
                  this.show(),
                    (0, utils_1.delay)(5e3).then(() => {
                      this.hide();
                    });
                }),
                this.emit("update-nodes", { node, parsedState });
            }
          }
          async hide() {
            await super.hide(),
              await (0, utils_1.transitionToPromise)(this),
              this.toggleMobileHeader(!0);
          }
          toggleMobileHeader = async (isToShow) => {
            if ((0, check_media_1.isMobile)()) {
              const header = (0, utils_1.$el)(HEADER_SELECTOR);
              header.parentElement.classList.toggle(
                HEADER_WITH_POPUP_CLASS,
                !isToShow
              ),
                this.wasHeaderHidden && header.setHidden(isToShow),
                await (0, utils_1.delay)(300);
            }
          };
        }
        exports.CartNotificationPopup = CartNotificationPopup;
      },
      1070: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartNotificationPopup = void 0);
        var cart_notification_popup_1 = __webpack_require__2(5237);
        Object.defineProperty(exports, "CartNotificationPopup", {
          enumerable: !0,
          get: function () {
            return cart_notification_popup_1.CartNotificationPopup;
          },
        });
      },
      8435: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ClipboardButtonTooltip = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(5260),
          dom_2 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          ARROW_SELECTOR = "[data-float-element-arrow]";
        class ClipboardButtonTooltip extends base_component_1.BaseComponent {
          element;
          removeUpdate = () => {};
          constructor() {
            super(),
              (this.element = (0, dom_2.getTemplateFirstChild)(
                (0, utils_1.$el)(
                  `[data-clipboard-button-tooltip-template="${this.id}"]`,
                  this
                )
              ));
          }
          updatePosition({ x, y }) {
            Object.assign(this.style, { left: `${x}px`, top: `${y}px` });
          }
          getOptions() {
            const arrowElement = (0, utils_1.$el)(ARROW_SELECTOR, this.element),
              middleware = [
                (0, dom_1.offset)({
                  alignmentAxis: +(this.dataset.alignmentAxisOffset || 0),
                  mainAxis: +(this.dataset.mainAxisOffset || 0),
                }),
                (0, dom_1.flip)(),
                (0, dom_1.shift)(),
              ];
            return (
              arrowElement &&
                middleware.push((0, dom_1.arrow)({ element: arrowElement })),
              {
                placement: this.dataset.placement || "bottom-end",
                middleware,
                strategy: "fixed",
              }
            );
          }
          updateArrow({ placement, middlewareData }) {
            const arrowElement = (0, utils_1.$el)(ARROW_SELECTOR, this.element);
            if (!arrowElement) return;
            const { x: arrowX, y: arrowY } = middlewareData.arrow,
              staticSide = {
                top: "bottom",
                right: "left",
                bottom: "top",
                left: "right",
              }[placement.split("-")[0]];
            Object.assign(arrowElement.style, {
              left: arrowX != null ? `${arrowX}px` : "",
              top: arrowY != null ? `${arrowY}px` : "",
              right: "",
              bottom: "",
              [staticSide]: "-5px",
            });
          }
          mount() {
            const floatElement = (0, utils_1.$el)(
              `[data-clipboard-button-tooltip-target-id="${this.id}"]`
            );
            this.replaceChildren(this.element),
              floatElement &&
                (this.removeUpdate = (0, dom_1.autoUpdate)(
                  floatElement,
                  this,
                  () => {
                    (0, dom_1.computePosition)(
                      floatElement,
                      this,
                      this.getOptions()
                    ).then((data) => {
                      this.updatePosition(data), this.updateArrow(data);
                    });
                  }
                ));
          }
          unmount() {
            this.replaceChildren(), this.removeUpdate();
          }
          show = () => {
            this.mount(), this.setVisible(!0), this.emit("show", {});
          };
          hide = () => {
            this.setVisible(!1), this.unmount(), this.emit("hide", {});
          };
          setVisible(isVisible) {
            this.setAttribute("aria-hidden", isVisible ? "false" : "true");
          }
        }
        exports.ClipboardButtonTooltip = ClipboardButtonTooltip;
      },
      8292: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ClipboardButton = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          key_1 = __webpack_require__2(9650);
        class ClipboardButton extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "click", this.handleButtonClick),
              this.addListener(this, "keydown", this.handleButtonKeydown);
          }
          handleButtonClick = (event) => {
            event.preventDefault(), this.copy();
          };
          handleButtonKeydown = (event) => {
            (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.copy());
          };
          copy = () => {
            const value = this.dataset.value;
            value &&
              navigator.clipboard &&
              navigator.clipboard
                .writeText(value)
                .then(() => {
                  this.showTooltip();
                })
                .catch((e) => {
                  throw (window.Shopify.designMode && this.showTooltip(), e);
                });
          };
          showTooltip() {
            const tooltip = (0, utils_1.$el)(`#${this.dataset.tooltipId}`);
            tooltip &&
              (tooltip.show(),
              (0, utils_1.delay)(1e3).then(() => {
                tooltip.hide();
              }));
          }
        }
        exports.ClipboardButton = ClipboardButton;
      },
      9911: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ClipboardButtonTooltip = exports.ClipboardButton = void 0);
        var clipboard_button_1 = __webpack_require__2(8292);
        Object.defineProperty(exports, "ClipboardButton", {
          enumerable: !0,
          get: function () {
            return clipboard_button_1.ClipboardButton;
          },
        });
        var clipboard_button_tooltip_1 = __webpack_require__2(8435);
        Object.defineProperty(exports, "ClipboardButtonTooltip", {
          enumerable: !0,
          get: function () {
            return clipboard_button_tooltip_1.ClipboardButtonTooltip;
          },
        });
      },
      5370: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CloseCursor = void 0);
        const base_component_1 = __webpack_require__2(3608),
          check_media_1 = __webpack_require__2(5580),
          utils_1 = __webpack_require__2(4083),
          OVERLAY_SELECTOR = "body-element";
        class CloseCursor extends base_component_1.BaseComponent {
          overlaySelector;
          isInited;
          overlay;
          constructor() {
            super(),
              (this.isInited = !1),
              (this.overlay = (0, utils_1.$el)(OVERLAY_SELECTOR));
          }
          handleMouseMove = (event) => {
            this.toggleVisibility(event);
          };
          toggleVisibility = (event) => {
            const target = event.target;
            this.checkIsOnOverlay(target)
              ? this.setVisible(event)
              : this.setHidden();
          };
          setVisible(event) {
            this.setAttribute("visible", "");
            const { clientY: top, clientX: left } = event;
            this.style.transform = `translate(calc(-50% + ${left}px), calc(-50% + ${top}px))`;
          }
          setHidden() {
            this.removeAttribute("visible");
          }
          setInitialVisibility = (clickEvent) => {
            const { clientY, clientX } = clickEvent,
              target = document.elementFromPoint(clientX, clientY);
            this.checkIsOnOverlay(target) && this.setVisible(clickEvent);
          };
          toggle(clickEvent) {
            !(0, check_media_1.isMobile)() &&
              this.overlay.isVisible &&
              (this.isInited ? this.deInit() : this.init(clickEvent));
          }
          init = (clickEvent) => {
            window.addEventListener("mousemove", this.handleMouseMove),
              clickEvent?.clientX && this.setInitialVisibility(clickEvent),
              (this.isInited = !0);
          };
          deInit() {
            window.removeEventListener("mousemove", this.handleMouseMove),
              this.setHidden(),
              (this.isInited = !1);
          }
          checkIsOnOverlay(target) {
            return target === this.overlay;
          }
        }
        exports.CloseCursor = CloseCursor;
      },
      3221: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CollapsedTags = void 0);
        const utils_1 = __webpack_require__2(4083),
          debounce_1 = __webpack_require__2(2731),
          base_component_1 = __webpack_require__2(3608);
        class CollapsedTags extends base_component_1.BaseComponent {
          extendButton;
          tags;
          hiddenTags;
          extendButtonWidth;
          maxRightPoint;
          resizeObserver;
          constructor() {
            super(),
              (this.tags = (0, utils_1.$list)("[data-tag]", this)),
              (this.hiddenTags =
                (0, utils_1.$el)("[data-collapsed-tags]", this) ??
                (0, utils_1.$el)("#show_other_tags")),
              (this.extendButton = (0, utils_1.$el)(
                "[data-extend-button]",
                this
              )),
              (this.extendButtonWidth = this.extendButton?.offsetWidth ?? 0),
              (this.maxRightPoint =
                this.getBoundingClientRect().right -
                this.extendButtonWidth -
                20);
          }
          mountComponent() {
            (this.resizeObserver = new ResizeObserver(
              this.handleContentResize
            )),
              this.resizeObserver.observe(this);
          }
          unmountComponent() {
            this.resizeObserver.disconnect();
          }
          handleContentResize = (0, debounce_1.debounce)(() => {
            this.setOffsets(), this.update();
          }, 200);
          updateButtonVisible() {
            if (!this.extendButton) return;
            const hiddenTags = this.querySelectorAll("[tag-hidden]"),
              hasHiddenTags = hiddenTags.length > 0;
            if (hasHiddenTags) {
              const left = hiddenTags[0].style.left;
              this.extendButton.style.left = left;
            }
            this.extendButton.classList.toggle("hidden", !hasHiddenTags),
              this.setAttribute("data-is-collapsed", hasHiddenTags.toString());
          }
          setOffsets() {
            this.tags.forEach((tag) => {
              (tag.style.left = `${tag.offsetLeft}px`),
                (tag.style.top = `${tag.offsetTop}px`);
            });
          }
          updateTagsVisible() {
            const collapsedTagsFragment = document.createDocumentFragment();
            this.tags.forEach((tag) => {
              const isOverflowed =
                tag.getBoundingClientRect().right > this.maxRightPoint;
              if (isOverflowed) {
                const clone = tag.cloneNode(!0);
                this.setTagVisible(clone, !0),
                  collapsedTagsFragment.appendChild(clone);
              }
              this.setTagVisible(tag, !isOverflowed);
            }),
              this.hiddenTags?.element.replaceChildren(collapsedTagsFragment);
          }
          setTagVisible(tag, isVisible) {
            tag.toggleAttribute("tag-hidden", !isVisible);
          }
          resetVisibility = () => {
            this.tags.forEach((tag) => {
              this.setTagVisible(tag, !1);
            });
          };
          update() {
            (this.extendButtonWidth = this.extendButton?.offsetWidth ?? 0),
              (this.maxRightPoint =
                this.getBoundingClientRect().right -
                this.extendButtonWidth -
                20),
              this.updateTagsVisible(),
              this.updateButtonVisible(),
              this.setAttribute("visible", "");
          }
        }
        exports.CollapsedTags = CollapsedTags;
      },
      3210: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CollapsedTags = void 0);
        var collapsed_tags_1 = __webpack_require__2(3221);
        Object.defineProperty(exports, "CollapsedTags", {
          enumerable: !0,
          get: function () {
            return collapsed_tags_1.CollapsedTags;
          },
        });
      },
      5177: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CountdownTimer = void 0);
        const utils_1 = __webpack_require__2(4083),
          dom_1 = __webpack_require__2(3889),
          base_component_1 = __webpack_require__2(3608),
          timer_storage_1 = __webpack_require__2(7921),
          types_1 = __webpack_require__2(1709),
          ONE_DAY_MS = 864e5,
          MONTHS = {
            january: 0,
            february: 1,
            march: 2,
            april: 3,
            may: 4,
            june: 5,
            july: 6,
            august: 7,
            september: 8,
            october: 9,
            november: 10,
            december: 11,
          },
          getEvergreenEndDate = (unit, value) => {
            const date = new Date();
            switch (unit) {
              case "day":
                date.setDate(date.getDate() + value);
                break;
              case "hour":
                date.setHours(date.getHours() + value);
                break;
              case "minute":
                date.setMinutes(date.getMinutes() + value);
                break;
              case "second":
                date.setSeconds(date.getSeconds() + value);
                break;
            }
            return date;
          };
        class CountdownTimer extends base_component_1.BaseComponent {
          mode = types_1.TimerMode.Fixed;
          endDate = new Date();
          timerRef;
          finishStrategy = types_1.TimerFinishStrategy.None;
          timerStorage;
          evergreenUnit;
          evergreenValue;
          daysUnit;
          hoursUnit;
          minutesUnit;
          secondsUnit;
          daysUnitLabel;
          hoursUnitLabel;
          minutesUnitLabel;
          secondsUnitLabel;
          constructor() {
            super(),
              (this.daysUnit = (0, utils_1.$el)("[data-timer-days]", this)),
              (this.hoursUnit = (0, utils_1.$el)("[data-timer-hours]", this)),
              (this.minutesUnit = (0, utils_1.$el)(
                "[data-timer-minutes]",
                this
              )),
              (this.secondsUnit = (0, utils_1.$el)(
                "[data-timer-seconds]",
                this
              )),
              (this.daysUnitLabel = (0, utils_1.$el)(
                "[data-timer-days-label]",
                this
              )),
              (this.hoursUnitLabel = (0, utils_1.$el)(
                "[data-timer-hours-label]",
                this
              )),
              (this.minutesUnitLabel = (0, utils_1.$el)(
                "[data-timer-minutes-label]",
                this
              )),
              (this.secondsUnitLabel = (0, utils_1.$el)(
                "[data-timer-seconds-label]",
                this
              )),
              (this.evergreenUnit = this.dataset.evergreenUnit || "minute"),
              (this.evergreenValue = parseInt(
                this.dataset.evergreenValue || "0"
              )),
              (this.mode = this.dataset.mode),
              this.mode === types_1.TimerMode.Fixed &&
                (this.finishStrategy =
                  this.dataset.hideOnComplete === "true"
                    ? types_1.TimerFinishStrategy.Hide
                    : types_1.TimerFinishStrategy.None),
              this.mode === types_1.TimerMode.Evergreen &&
                ((this.finishStrategy =
                  this.dataset.evergreenOnComplete ||
                  types_1.TimerFinishStrategy.Restart),
                (this.timerStorage = new timer_storage_1.TimerStorage(
                  this.dataset.blockId || this.id
                )));
          }
          mountComponent() {
            this.start();
          }
          unmountComponent() {
            clearInterval(this.timerRef);
          }
          getHash() {
            return `${this.finishStrategy}-${this.evergreenUnit}-${this.evergreenValue}`;
          }
          start() {
            if (this.mode === types_1.TimerMode.Fixed) {
              const year = Number(this.dataset.year),
                month = MONTHS[this.dataset.month ?? "january"],
                day = Number(this.dataset.day),
                hour = Number(this.dataset.hour),
                minute = Number(this.dataset.minute);
              this.endDate = new Date(year, month, day, hour, minute);
            }
            if (this.mode === types_1.TimerMode.Evergreen) {
              const timerData = this.timerStorage.loadData();
              !timerData || timerData.hash !== this.getHash()
                ? this.updateEvergreenData()
                : (this.endDate = timerData.endDate);
            }
            (this.timerRef = window.setInterval(this.tick.bind(this), 1e3)),
              this.tick();
          }
          updateEvergreenData() {
            const endDate = getEvergreenEndDate(
              this.evergreenUnit,
              this.evergreenValue
            );
            this.timerStorage.saveData({ endDate, hash: this.getHash() }),
              (this.endDate = endDate);
          }
          finish() {
            switch ((clearInterval(this.timerRef), this.finishStrategy)) {
              case types_1.TimerFinishStrategy.Restart:
                this.timerStorage.saveData({
                  endDate: getEvergreenEndDate(
                    this.evergreenUnit,
                    this.evergreenValue
                  ),
                  hash: this.getHash(),
                }),
                  this.start();
                break;
              case types_1.TimerFinishStrategy.WaitOneDay:
                if (
                  new Date().getTime() - this.endDate.getTime() >
                  ONE_DAY_MS
                ) {
                  const endDate = getEvergreenEndDate(
                    this.evergreenUnit,
                    this.evergreenValue
                  );
                  this.timerStorage.saveData({ endDate, hash: this.getHash() }),
                    this.start();
                } else this.hide();
                break;
              case types_1.TimerFinishStrategy.None:
                this.show();
                break;
              default:
                this.hide();
            }
          }
          renderTime(days, hours, minutes, seconds) {
            !this.daysUnit ||
              !this.hoursUnit ||
              !this.minutesUnit ||
              !this.secondsUnit ||
              ((this.daysUnit.innerText = days.toString()),
              (this.hoursUnit.innerText = hours.toString()),
              (this.minutesUnit.innerText = minutes.toString()),
              (this.secondsUnit.innerText = seconds.toString()),
              this.renderLabels(days, hours, minutes, seconds));
          }
          renderLabels(days, hours, minutes, seconds) {
            !this.daysUnitLabel ||
              !this.hoursUnitLabel ||
              !this.minutesUnitLabel ||
              !this.secondsUnitLabel ||
              ((this.daysUnitLabel.innerText =
                days === 1
                  ? window.auroraThemeLocales.countdownTimerString.day
                  : window.auroraThemeLocales.countdownTimerString.days),
              (this.hoursUnitLabel.innerText =
                hours === 1
                  ? window.auroraThemeLocales.countdownTimerString.hour
                  : window.auroraThemeLocales.countdownTimerString.hours),
              (this.minutesUnitLabel.innerText =
                minutes === 1
                  ? window.auroraThemeLocales.countdownTimerString.minute
                  : window.auroraThemeLocales.countdownTimerString.minutes),
              (this.secondsUnitLabel.innerText =
                seconds === 1
                  ? window.auroraThemeLocales.countdownTimerString.second
                  : window.auroraThemeLocales.countdownTimerString.seconds));
          }
          tick() {
            const diff = this.endDate.getTime() - new Date().getTime();
            if (diff > 0) {
              this.show(),
                this.renderTime(
                  Math.floor(diff / 864e5),
                  Math.floor((diff % 864e5) / 36e5),
                  Math.floor((diff % 36e5) / 6e4),
                  Math.floor((diff % 6e4) / 1e3)
                );
              return;
            }
            this.renderTime(0, 0, 0, 0),
              this.finish(),
              window.Shopify.designMode && this.show();
          }
          show() {
            (0, dom_1.showElement)(this),
              this.dataset.blockId &&
                (0, dom_1.showElement)(
                  (0, utils_1.$el)(`.block-${this.dataset.blockId}`)
                );
          }
          hide() {
            window.Shopify.designMode ||
              (this.dataset.sectionId &&
                (0, dom_1.hideElement)(
                  (0, utils_1.$el)(`.section-${this.dataset.sectionId}`)
                ),
              this.dataset.blockId &&
                (0, dom_1.hideElement)(
                  (0, utils_1.$el)(`.block-${this.dataset.blockId}`)
                ),
              (0, dom_1.hideElement)(this));
          }
        }
        exports.CountdownTimer = CountdownTimer;
      },
      5950: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CountdownTimer = void 0);
        var countdown_timer_1 = __webpack_require__2(5177);
        Object.defineProperty(exports, "CountdownTimer", {
          enumerable: !0,
          get: function () {
            return countdown_timer_1.CountdownTimer;
          },
        });
      },
      7921: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TimerStorage = void 0);
        const STORAGE_KEY = "AuroraTheme-Timer";
        class TimerStorage {
          _blockId;
          constructor(blockId) {
            this._blockId = blockId;
          }
          parseData(data) {
            try {
              const obj = JSON.parse(data ?? "{}");
              return "endDate" in obj && "hash" in obj
                ? { endDate: new Date(+obj.endDate), hash: obj.hash }
                : null;
            } catch {
              return null;
            }
          }
          saveData(data) {
            try {
              localStorage.setItem(
                `${STORAGE_KEY}-${this._blockId}`,
                JSON.stringify({
                  endDate: data.endDate.getTime(),
                  hash: data.hash,
                })
              );
            } catch {}
          }
          loadData() {
            try {
              return this.parseData(
                localStorage.getItem(`${STORAGE_KEY}-${this._blockId}`)
              );
            } catch {
              return null;
            }
          }
        }
        exports.TimerStorage = TimerStorage;
      },
      1709: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TimerFinishStrategy = exports.TimerMode = void 0);
        var TimerMode;
        (function (TimerMode2) {
          (TimerMode2.Fixed = "fixed"), (TimerMode2.Evergreen = "evergreen");
        })(TimerMode || (exports.TimerMode = TimerMode = {}));
        var TimerFinishStrategy;
        (function (TimerFinishStrategy2) {
          (TimerFinishStrategy2.None = "none"),
            (TimerFinishStrategy2.Hide = "hide"),
            (TimerFinishStrategy2.Restart = "restart"),
            (TimerFinishStrategy2.WaitOneDay = "wait_one_day");
        })(
          TimerFinishStrategy ||
            (exports.TimerFinishStrategy = TimerFinishStrategy = {})
        );
      },
      8745: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.DeferredMedia = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          POSTER_SELECTOR = '[id^="Deferred-Poster-"]',
          CAROUSEL_SELECTOR = "carousel-component",
          SLIDE_ATTRIBUTE = "[data-media-id]",
          AUTOPLAY_ATTRIBUTE = "data-autoplay",
          CONTROLS_ATTRIBUTE = "data-enable-controls";
        class DeferredMedia extends base_component_1.BaseComponent {
          carousel;
          video;
          isTouched;
          mountComponent() {
            (this.carousel = (0, utils_1.$elParent)(CAROUSEL_SELECTOR, this)),
              this.carousel?.embla.on("settle", this.handleCarouselSettle),
              this.hasAttribute(AUTOPLAY_ATTRIBUTE)
                ? this.loadContent()
                : this.addListener(this, "click", this.handlePosterClick);
          }
          unmountComponent() {
            this.carousel?.embla.off("settle", this.handleCarouselSettle);
          }
          handleCarouselSettle = () => {
            if (this.video?.tagName === "VIDEO") {
              const isSelected = (0, utils_1.$elParent)(
                SLIDE_ATTRIBUTE,
                this
              ).className.includes("is-selected");
              if (isSelected && this.isTouched) return;
              const withAutoplay = this.video.hasAttribute("autoplay");
              isSelected && withAutoplay
                ? this.video.play()
                : isSelected || (this.video.pause(), (this.isTouched = !1));
            }
          };
          handlePosterClick = (event) => {
            (0, utils_1.$elParent)(POSTER_SELECTOR, event.target) &&
              this.loadContent();
          };
          handleUncontrolledVideoClick = () => {
            this.video.paused ? this.video.play() : this.video.pause(),
              (this.isTouched = !0);
          };
          loadContent() {
            this.getAttribute("loaded") ||
              (this.addVideo(), this.setAttribute("loaded", "true"));
          }
          removeVideo() {
            const video = (0, utils_1.$el)("video,  iframe", this);
            video && (video.remove(), this.removeAttribute("loaded"));
          }
          addVideo() {
            const content = document.createElement("div"),
              templateContent = (0, utils_1.$el)("template", this)?.content;
            if (!templateContent || !templateContent.firstElementChild) return;
            const firstChild = templateContent.firstElementChild.cloneNode(!0);
            content.appendChild(firstChild);
            const video = (0, utils_1.$el)(
              "video, model-viewer, iframe",
              content
            );
            video &&
              (this.appendChild(video),
              (this.video = video),
              video.tagName === "VIDEO" &&
                (this.video.play(),
                this.hasAttribute(CONTROLS_ATTRIBUTE) ||
                  this.addListener(
                    this,
                    "click",
                    this.handleUncontrolledVideoClick
                  )));
          }
        }
        exports.DeferredMedia = DeferredMedia;
      },
      7230: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.DeferredMedia = void 0);
        var deffered_media_1 = __webpack_require__2(8745);
        Object.defineProperty(exports, "DeferredMedia", {
          enumerable: !0,
          get: function () {
            return deffered_media_1.DeferredMedia;
          },
        });
      },
      8510: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.DropdownOpener = void 0);
        const utils_1 = __webpack_require__2(4083),
          key_1 = __webpack_require__2(9650),
          base_component_1 = __webpack_require__2(3608),
          HEADER_BUTTON_SELECTOR = "data-header-btn-with-backdrop",
          HEADER_FLOATELEMENT_SELECTOR = "[data-header-float-element-template]";
        class DropdownOpener extends base_component_1.BaseComponent {
          hideTimeoutId;
          element;
          isHeaderBtn;
          floatElementId;
          constructor() {
            super(),
              (this.element = this.getElement()),
              (this.isHeaderBtn = this.hasAttribute(HEADER_BUTTON_SELECTOR)),
              this.isHeaderBtn &&
                (this.floatElementId = this.firstElementChild.getAttribute(
                  "data-float-element-trigger"
                ));
          }
          mountComponent() {
            this.floatElement &&
              (customElements.upgrade(this.floatElement),
              this.floatElement?.on("show", this.handleDropdownShow),
              this.floatElement?.on("hide", this.handleDropdownHide)),
              this.addListener(this.element, "keydown", this.handleKeyDown),
              this.addListener(this.element, "click", this.handleTrigger);
          }
          unmountComponent() {
            this.floatElement &&
              (customElements.upgrade(this.floatElement),
              this.floatElement?.off("show", this.handleDropdownShow),
              this.floatElement?.off("hide", this.handleDropdownHide)),
              clearTimeout(this.hideTimeoutId),
              this.removeListener(this.element, "blur", this.handleBlur);
          }
          handleBlur = () => {
            this.hideTimeoutId = setTimeout(() => {
              this.hideFloatElement();
            }, 0);
          };
          handleDropdownShow = () => {
            this.setTargetListeners("add");
          };
          handleDropdownHide = () => {
            this.setTargetListeners("remove"), clearTimeout(this.hideTimeoutId);
          };
          handleKeyDown = (event) => {
            const { firstTarget } = this.getTargets();
            (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(),
              this.showFloatElement(),
              this.addListener(this.element, "blur", this.handleBlur)),
              (0, key_1.isTabKey)(event) &&
                firstTarget &&
                this.floatElement.isOpen &&
                !event.shiftKey &&
                (event.preventDefault(),
                firstTarget.focus(),
                clearTimeout(this.hideTimeoutId));
          };
          handleHeaderKeyDown = (event) => {
            (0, key_1.isEscKey)(event) &&
              (event.preventDefault(),
              this.floatElement.hide(),
              this.emit("openerClickOutside", { element: this, opener: this }),
              this.removeListener(window, "keydown", this.handleHeaderKeyDown));
          };
          handleFirstTargetFocus = () => {};
          handleTargetFocus = () => {
            clearTimeout(this.hideTimeoutId);
          };
          handleLastTargetBlur = () => {
            this.hideTimeoutId = setTimeout(() => {
              this.hideFloatElement(), this.focus();
            }, 0);
          };
          hideFloatElement() {
            this.floatElement && this.floatElement.hide();
          }
          showFloatElement() {
            this.floatElement && this.floatElement.show();
          }
          handleTrigger = (event) => {
            event.preventDefault(), this.trigger();
          };
          handleUntrigger = ({ clientX: x, clientY: y, target }) => {
            if (
              !this.floatElement ||
              (this.isHeaderBtn &&
                target.closest(`[${HEADER_BUTTON_SELECTOR}]`))
            )
              return;
            let isToCloseDropDown;
            if (this.isHeaderBtn)
              isToCloseDropDown = !target.closest(
                "[data-header-float-element-template]"
              );
            else {
              const isCursorOutside = this.floatElement.checkCursorOutside(
                  x,
                  y
                ),
                isOutsideFloatElements =
                  this.isTargetOutsideFloatElements(target);
              isToCloseDropDown = isCursorOutside && isOutsideFloatElements;
            }
            isToCloseDropDown &&
              (this.floatElement.hide(),
              this.emit("openerClickOutside", { element: this, opener: this }),
              this.removeListener(window, "keydown", this.handleHeaderKeyDown));
          };
          setTargetListeners(action) {
            const { targets, firstTarget, lastTarget } = this.getTargets(),
              listenerSetter =
                action === "add" ? "addListener" : "removeListener";
            this[listenerSetter](
              firstTarget,
              "focus",
              this.handleFirstTargetFocus
            ),
              targets.forEach((target) =>
                this[listenerSetter](target, "focus", this.handleTargetFocus)
              ),
              this[listenerSetter](
                lastTarget,
                "blur",
                this.handleLastTargetBlur
              ),
              this[listenerSetter](window, "click", this.handleUntrigger);
          }
          getTargets() {
            if (!this.floatElement) return;
            const element = this.floatElement.element,
              targets = (0, utils_1.$list)(
                (0, utils_1.getFocusTargets)(),
                element
              ),
              firstTarget = targets[0],
              lastTarget = targets[targets.length - 1];
            return { targets, firstTarget, lastTarget };
          }
          isTargetOutsideFloatElements(target) {
            if (!this.floatElement) return;
            const isInsideFloatElement = this.floatElement.contains(target),
              isInsideFloatElementBtn = this.contains(target);
            return !isInsideFloatElement && !isInsideFloatElementBtn;
          }
          getElement() {
            return (
              (0, utils_1.$el)(
                `[data-float-element-trigger="${this.dataset.floatElementId}"]`,
                this
              ) || this
            );
          }
          trigger = () => {
            this.floatElement &&
              (this.floatElement.isOpen && !this.isHeaderBtn
                ? this.floatElement.hide()
                : this.floatElement.show(),
              this.addListener(window, "click", this.handleUntrigger),
              this.isHeaderBtn &&
                (this.emit("openerClick", { element: this, opener: this }),
                this.addListener(window, "keydown", this.handleHeaderKeyDown)));
          };
          setExpand(isExpanded) {
            this.setAttribute("data-aria-expanded", isExpanded);
          }
          get floatElement() {
            return (0, utils_1.$el)(`#${this.dataset.floatElementId}`);
          }
        }
        exports.DropdownOpener = DropdownOpener;
      },
      3e3: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.FloatElementBtn = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          key_1 = __webpack_require__2(9650),
          safe_polygon_1 = __webpack_require__2(6709);
        class FloatElementBtn extends base_component_1.BaseComponent {
          element;
          safePolygonFn;
          hideTimeoutId;
          constructor() {
            super(), (this.element = this.getElement());
          }
          mountComponent() {
            this.addListener(this.element, "keydown", this.handleKeyDown),
              this.addListener(this.element, "blur", this.handleBlur),
              this.dataset.trigger === "click"
                ? (this.addListener(window, "click", this.handleWindowClick),
                  this.addListener(
                    this.element,
                    "click",
                    this.handleElementClick
                  ))
                : (this.addListener(
                    this.element,
                    "mouseleave",
                    this.handleMouseLeave
                  ),
                  this.addListener(
                    this.element,
                    "mouseenter",
                    this.handleMouseEnter
                  ),
                  this.addListener(
                    this.element,
                    "touchend",
                    this.handleTouchend
                  ));
          }
          handleKeyDown = (event) => {
            const { firstTarget } = (0, utils_1.getTargets)(
              this.floatElement.element
            );
            (0, key_1.isTabKey)(event) &&
              !event.shiftKey &&
              (this.isOpen ||
                (event.preventDefault(), this.floatElement.show()),
              firstTarget &&
                (event.preventDefault(),
                this.setTargetListeners("add"),
                firstTarget.focus()));
          };
          handleBlur = () => {
            this.hideTimeoutId = setTimeout(() => {
              this.hideFloatElement();
            }, 0);
          };
          handleFirstTargetFocus = () => {};
          handleTargetFocus = () => {
            clearTimeout(this.hideTimeoutId);
          };
          handleLastTargetBlur = ({ currentTarget }) => {
            this.emit("lastTargetBlured", { button: this }),
              (this.hideTimeoutId = setTimeout(() => {
                this.hideFloatElement();
              }, 0));
          };
          hideFloatElement() {
            this.setTargetListeners("remove"), this.floatElement.hide();
          }
          handleMouseEnter = (event) => {
            event.stopPropagation(), this.trigger();
          };
          handleElementClick = () => {
            this.trigger();
          };
          handleWindowClick = (event) => {
            const isCursorOutside = this.floatElement.checkCursorOutside(
                event.clientX,
                event.clientY
              ),
              isOutsideFloatElements = this.isTargetOutsideFloatElements(
                event.target
              );
            isCursorOutside &&
              isOutsideFloatElements &&
              this.floatElement.isOpen &&
              (this.removeListener(window, "click", this.handleWindowClick),
              this.floatElement.hide());
          };
          handleMouseLeave = (event) => {
            this.safePolygonFn &&
              this.removeListener(window, "mousemove", this.handleMouseMove),
              (this.safePolygonFn = (0, safe_polygon_1.safePolygon)()({
                x: event.clientX,
                y: event.clientY,
                placement: this.floatElement.dataset.placement,
                onClose: () => {
                  this.removeListener(
                    window,
                    "mousemove",
                    this.handleMouseMove
                  ),
                    this.floatElement &&
                      this.floatElement.isOpen &&
                      this.floatElement.hide();
                },
                elements: {
                  domReference: this.element,
                  floating: this.floatElement,
                },
                nodeId: null,
                tree: null,
              })),
              this.safePolygonFn(event),
              this.addListener(window, "mousemove", this.handleMouseMove);
          };
          handleMouseMove = (event) => {
            this.safePolygonFn(event);
          };
          handleTouchend = (event) => {
            this.isOpen ||
              (event.preventDefault(),
              this.floatElement.show(),
              this.addListener(window, "click", this.handleWindowClick),
              (0, utils_1.$list)('[data-aria-expanded="true"]').forEach(
                (btn) => {
                  btn !== this && btn.floatElement.hide();
                }
              ));
          };
          setTargetListeners(action) {
            const { targets, firstTarget, lastTarget } = (0,
              utils_1.getTargets)(this.floatElement.element),
              listenerSetter =
                action === "add" ? "addListener" : "removeListener";
            this[listenerSetter](
              firstTarget,
              "focus",
              this.handleFirstTargetFocus
            ),
              targets.forEach((target) => {
                this[listenerSetter](target, "focus", this.handleTargetFocus);
              }),
              this[listenerSetter](
                lastTarget,
                "blur",
                this.handleLastTargetBlur
              ),
              this[listenerSetter](window, "click", this.handleWindowClick);
          }
          getElement() {
            return (
              (0, utils_1.$el)(
                `[data-float-element-trigger="${this.dataset.floatElementId}"]`,
                this
              ) || this
            );
          }
          isTargetOutsideFloatElements(target) {
            return (
              !this.floatElement.contains(target) && !this.contains(target)
            );
          }
          trigger = () => {
            (this.dataset.trigger === "click" ? "click" : "mouseenter") ===
            "click"
              ? (this.floatElement.isOpen
                  ? this.floatElement.hide()
                  : this.floatElement.show(),
                this.addListener(window, "click", this.handleWindowClick))
              : (this.floatElement.show(),
                this.addListener(
                  this.element,
                  "mouseleave",
                  this.handleMouseLeave
                ));
          };
          setExpand(isExpanded) {
            this.setAttribute("data-aria-expanded", isExpanded);
          }
          get floatElement() {
            if (this.dataset.floatElementId)
              return (0, utils_1.$el)(`#${this.dataset.floatElementId}`);
          }
          get isOpen() {
            return this.floatElement.isOpen;
          }
        }
        exports.FloatElementBtn = FloatElementBtn;
      },
      9448: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.FloatElement = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(5260),
          dom_2 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          key_1 = __webpack_require__2(9650),
          ARROW_SELECTOR = "[data-float-element-arrow]",
          BODY_ELEMENT_SELECTOR = "body-element";
        class FloatElement extends base_component_1.BaseComponent {
          initialPlacement;
          element;
          arrow;
          removeUpdate = () => {};
          constructor() {
            super(),
              (this.element = (0, dom_2.getTemplateFirstChild)(
                (0, utils_1.$el)(
                  `[data-float-element-template="${this.id}"]`,
                  this
                )
              )),
              (this.arrow = (0, utils_1.$el)(ARROW_SELECTOR, this.element)),
              (this.initialPlacement = this.dataset.placement),
              this.hasAttribute("data-with-portal") &&
                (0, utils_1.createPortal)(this, document.body);
          }
          mountComponent() {
            super.mountComponent(),
              this.isEditor &&
                (this.editor.on("BLOCK_SELECT", this.handleBlockSelect),
                this.editor.on("BLOCK_DESELECT", this.handleBlockDeselect));
          }
          unmountComponent() {
            super.unmountComponent(),
              this.isEditor &&
                (this.editor.off("BLOCK_SELECT", this.handleBlockSelect),
                this.editor.off("BLOCK_DESELECT", this.handleBlockDeselect));
          }
          handleDropdownKeyDown = (event) => {
            (0, key_1.isEscKey)(event) && (event.preventDefault(), this.hide());
          };
          handleScroll = () => {
            this.dataset.type === "tooltip" &&
              (this.hide(),
              this.removeListener(window, "wheel", this.handleScroll));
          };
          handleBlockSelect = ({ detail: { blockId, sectionId } }) => {
            if (this.dataset.sectionId === sectionId) {
              const target = (0, utils_1.$el)(
                  `[block-id="${blockId}"]`,
                  this.element
                ),
                isTarget = this.getAttribute("block-id") === blockId || target,
                btn = (0, utils_1.$el)(
                  `[data-float-element-id="${this.id}"], [data-tooltip-id="${this.id}"]`
                );
              if (!isTarget) return;
              btn ? btn.trigger() : this.hide();
            }
          };
          handleBlockDeselect = ({ detail: { blockId, sectionId } }) => {
            if (this.dataset.sectionId === sectionId) {
              const target = (0, utils_1.$el)(
                `[block-id="${blockId}"]`,
                this.element
              );
              if (!(this.getAttribute("block-id") === blockId || target))
                return;
              this.hide();
            }
          };
          updatePosition({ x, y }) {
            Object.assign(this.style, { left: `${x}px`, top: `${y}px` });
          }
          getOptions() {
            const middleware = [
              (0, dom_1.offset)({
                alignmentAxis: +(this.dataset.alignmentAxisOffset || 0),
                mainAxis: +(this.dataset.mainAxisOffset || 0),
              }),
              (0, dom_1.flip)(),
              (0, dom_1.shift)(),
            ];
            return (
              this.arrow &&
                middleware.push((0, dom_1.arrow)({ element: this.arrow })),
              {
                placement: this.dataset.placement,
                middleware,
                strategy: this.dataset.strategy || "absolute",
              }
            );
          }
          checkCursorOutside(x, y) {
            const offset = +(this.dataset.mainAxisOffset || 0),
              interactiveBorder = 2,
              boundaries = this.getBoundingClientRect(),
              exceedsTop = boundaries.top - (y + offset) > interactiveBorder,
              exceedsBottom =
                y - boundaries.bottom - offset > interactiveBorder,
              exceedsLeft = boundaries.left - (x + offset) > interactiveBorder,
              exceedsRight = x - boundaries.right - offset > interactiveBorder;
            return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
          }
          updateArrow({ placement, middlewareData }) {
            if (!this.arrow) return;
            const { x: arrowX, y: arrowY } = middlewareData.arrow,
              staticSide = {
                top: "bottom",
                right: "left",
                bottom: "top",
                left: "right",
              }[placement.split("-")[0]];
            Object.assign(this.arrow.style, {
              left: arrowX != null ? `${arrowX}px` : "",
              top: arrowY != null ? `${arrowY}px` : "",
              right: "",
              bottom: "",
              [staticSide]: "-5px",
            });
          }
          mount() {
            this.replaceChildren(this.element), this.setUpdate();
          }
          unmount() {
            this.removeUpdate(), this.replaceChildren();
          }
          show = async () => {
            const bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR);
            if (this.dataset.type === "tooltip" && bodyElement.isScrolling)
              return;
            this.mount(),
              this.setVisible(!0),
              await (0, utils_1.transitionToPromise)(this),
              (0, utils_1.$list)("lazy-video", this).forEach((video) => {
                video.initVideo();
              }),
              this.addListener(window, "wheel", this.handleScroll),
              this.addListener(window, "keydown", this.handleDropdownKeyDown),
              this.emit("show", { element: this.element });
          };
          hide = async () => {
            this.setVisible(!1),
              await (0, utils_1.transitionToPromise)(this),
              this.isOpen ||
                (this.removeListener(window, "wheel", this.handleScroll),
                this.removeListener(
                  window,
                  "keydown",
                  this.handleDropdownKeyDown
                ),
                (this.dataset.placement = this.initialPlacement),
                this.unmount(),
                this.emit("hide", { element: this.element }));
          };
          setUpdate() {
            const btn = (0, utils_1.$el)(
                `[data-float-element-id="${this.id}"], [data-tooltip-id="${this.id}"]`
              ),
              floatElement =
                (0, utils_1.$el)(`#${this.dataset.floatingElementId}`) || btn;
            floatElement &&
              (this.removeUpdate = (0, dom_1.autoUpdate)(
                floatElement,
                this,
                () => {
                  (0, dom_1.computePosition)(
                    floatElement,
                    this,
                    this.getOptions()
                  ).then((data) => {
                    this.dataset.placement !== data.placement &&
                      (this.dataset.placement = data.placement),
                      this.updatePosition(data),
                      this.arrow && this.updateArrow(data);
                  });
                }
              ));
          }
          setVisible(isVisible) {
            const bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR);
            this.setAttribute("aria-hidden", isVisible ? "false" : "true"),
              this.setBtnExpand(isVisible),
              this.hasAttribute("data-with-overlay") &&
                (0, utils_1.whenDefined)("body-element").then(() => {
                  this.isOpen
                    ? bodyElement.showOverlay(this.id, {})
                    : bodyElement.hideOverlay(this.id);
                });
          }
          setBtnExpand = (isVisible) => {
            const btn = (0, utils_1.$el)(
              `[data-float-element-id="${this.id}"], [data-tooltip-id="${this.id}"]`
            );
            btn && btn.setExpand(isVisible);
          };
          get isOpen() {
            return this.getAttribute("aria-hidden") === "false";
          }
        }
        exports.FloatElement = FloatElement;
      },
      4732: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.HeaderFloatElementBtn = void 0);
        const utils_1 = __webpack_require__2(4083),
          _1 = __webpack_require__2(1279),
          key_1 = __webpack_require__2(9650);
        class HeaderFloatElementBtn extends _1.FloatElementBtn {
          floatElementContainerId;
          floatElementId;
          isFocused;
          isTouched;
          constructor() {
            super(),
              (this.floatElementContainerId = this.dataset.floatElementId),
              (this.element = this.firstElementChild),
              (this.floatElementId =
                this.element.dataset.headerFloatElementTrigger),
              this.addListener(this.element, "touchend", this.handleTouchend);
          }
          handleTouchend = (event) => {
            this.isOpen ||
              (this.addListener(document, "touchend", this.handleWindowClick),
              (0, utils_1.$list)('[data-aria-expanded="true"]').forEach(
                (btn) => {
                  btn !== this && btn.floatElement.hide();
                }
              )),
              this.isTouched ||
                (event.preventDefault(),
                this.header.handleButtonHover(this),
                this.setExpand(!0),
                (this.isTouched = !0));
          };
          handleWindowClick = ({ target }) => {
            if (target.closest(".header__dropdown-menu")) return;
            const isButton = target.closest("header-float-element-btn");
            isButton !== this && (this.isTouched = !1),
              isButton ||
                (this.header.handleMouseLeave(),
                this.setExpand(!1),
                this.removeListener(
                  document,
                  "touchend",
                  this.handleWindowClick
                ),
                (this.isTouched = !1));
          };
          handleMouseLeave = (event) => {
            event.stopPropagation();
          };
          handleMouseEnter = (event) => {
            event.stopPropagation();
          };
          handleKeyDown = (event) => {
            if ((0, key_1.isTabKey)(event) && !event.shiftKey) {
              if (
                (event.preventDefault(),
                this.emit("focused", { button: this }),
                !this.isOpen)
              ) {
                this.closest("header-component").handleButtonHover(this),
                  this.setExpand(!0);
                return;
              }
              const { targets, lastTarget } = (0, utils_1.getTargets)(
                  this.floatElement.currentVisible,
                  !1
                ),
                firstTarget = targets.find(
                  (el) => !el.hasAttribute("disabled")
                );
              firstTarget &&
                !this.isFocused &&
                (this.addListener(
                  lastTarget,
                  "blur",
                  this.handleLastTargetBlur
                ),
                firstTarget.focus(),
                (this.isFocused = !0));
            }
          };
          handleLastTargetBlur = ({ currentTarget }) => {
            const header = this.closest("header-component");
            header.handleMouseLeave();
            let nextToFocus;
            this.hasAttribute("data-is-last-menu-item")
              ? (nextToFocus = (0, utils_1.getTargets)(
                  header.navContainer.nextElementSibling
                ).firstTarget)
              : (nextToFocus = this.nextElementSibling?.hasAttribute("href")
                  ? this.nextElementSibling
                  : this.nextElementSibling.firstElementChild),
              nextToFocus?.focus(),
              this.setExpand(!1),
              (this.isFocused = !1),
              this.removeListener(
                currentTarget,
                "blur",
                this.handleLastTargetBlur
              );
          };
          handleBlur = () => {
            this.emit("blured", { button: this });
          };
          trigger = () => {};
          setExpand(isExpanded) {
            this.setAttribute("data-aria-expanded", isExpanded);
          }
          get isOpen() {
            return this.dataset.ariaExpanded === "true";
          }
          get header() {
            return this.closest("header-component");
          }
        }
        exports.HeaderFloatElementBtn = HeaderFloatElementBtn;
      },
      6308: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.HeaderFloatElement = void 0);
        const dom_1 = __webpack_require__2(3889),
          _1 = __webpack_require__2(1279),
          utils_1 = __webpack_require__2(4083),
          debounce_1 = __webpack_require__2(2731),
          key_1 = __webpack_require__2(9650),
          BODY_ELEMENT_SELECTOR = "body-element";
        class HeaderFloatElement extends _1.FloatElement {
          currentVisible;
          mounted;
          constructor() {
            super();
            const templates = (0, utils_1.$list)("template", this),
              fragment = document.createDocumentFragment();
            templates.forEach((template) => {
              const content = (0, dom_1.getTemplateFirstChild)(template);
              content.setAttribute(
                "data-header-float-element-template",
                template.dataset.headerFloatElementTemplate
              ),
                content.setAttribute("inert", ""),
                fragment.appendChild(content);
            }),
              (this.element = fragment),
              (this.mounted = !1),
              (this.initialPlacement = this.dataset.placement);
          }
          mountComponent() {
            super.mountComponent();
            const header = (0, utils_1.$el)("header-component");
            customElements.whenDefined("header-component").then(() => {
              header.on("headerButtonHover", this.handleButtonHover),
                header.on("mouseLeavedHeader", this.handleMouseLeave);
            });
          }
          unmountComponent() {
            super.unmountComponent();
          }
          handleMouseLeave = () => {
            this.isOpen || (this.hide(), this.toggleVideos(!1));
          };
          handleButtonHover = ({ floatElementId }) => {
            this.toggleElementVisible(floatElementId),
              this.show(),
              this.toggleVideos(!0);
          };
          toggleVideos = (isToPlay) => {
            (0, utils_1.$list)("video", this).forEach((video) => {
              isToPlay ? video.play() : video.pause();
            });
          };
          toggleElementVisible = (floatElementId) => {
            this.currentVisible &&
              (this.currentVisible.removeAttribute("visible"),
              this.currentVisible.setAttribute("inert", ""));
            const visible = (this.mounted ? this : this.element).querySelector(
              `[data-header-float-element-template=${floatElementId}]`
            );
            visible.removeAttribute("inert"),
              visible.setAttribute("visible", ""),
              (this.currentVisible = visible),
              this.emit("dropDownVisible", { el: this.currentVisible });
          };
          setVisible(isVisible) {
            const bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR);
            this.setAttribute("aria-hidden", isVisible ? "false" : "true");
            const styles = { zIndex: 2 };
            isVisible
              ? bodyElement.showOverlay(this.id, styles)
              : bodyElement.hideOverlay(this.id);
          }
          mount() {
            this.mounted || this.replaceChildren(this.element),
              this.setUpdate(),
              (this.mounted = !0);
          }
          unmount() {
            this.removeUpdate();
          }
          handleDropdownKeyDown = (event) => {
            (0, key_1.isEscKey)(event) && event.preventDefault();
          };
          setBtnExpand = (isVisible) => {};
          handleBlockSelect = (0, debounce_1.debounce)(
            ({ detail: { blockId, sectionId } }) => {
              if (this.dataset.sectionId === sectionId) {
                if (
                  !this.header.navContainer ||
                  this.header.navContainer.hasAttribute("hidden")
                )
                  return;
                const target = this.getTargetWhenBlockChange(blockId);
                if (!target) {
                  this.header.handleMouseLeave();
                  return;
                }
                const floatElementId = target.getAttribute(
                    "data-header-float-element-template"
                  ),
                  targetButton = (0, utils_1.$list)(
                    "[data-header-btn-with-backdrop]"
                  ).find((btn) =>
                    btn.floatElementId
                      ? btn.floatElementId === floatElementId
                      : btn.firstElementChild.getAttribute(
                          "data-float-element-trigger"
                        ) === floatElementId
                  );
                (this.header.blockInEditorSelected = !0),
                  this.header.handleButtonHover(targetButton),
                  this.addListener(document, "click", this.handleOutsideClick);
              }
            },
            50
          );
          handleBlockDeselect = (0, debounce_1.debounce)(
            ({ detail: { blockId, sectionId } }) => {
              if (this.dataset.sectionId === sectionId) {
                if (
                  !this.header.navContainer ||
                  this.header.navContainer.hasAttribute("hidden")
                )
                  return;
                this.getTargetWhenBlockChange(blockId) ===
                  this.currentVisible &&
                  ((this.header.blockInEditorSelected = !1),
                  this.header.handleMouseLeave(),
                  this.removeListener(
                    document,
                    "click",
                    this.handleOutsideClick
                  ));
              }
            },
            100
          );
          getTargetWhenBlockChange = (blockId) => {
            const parent = this.mounted ? this : this.element;
            return (0, utils_1.$el)(`[block-id="${blockId}"]`, parent);
          };
          handleOutsideClick = ({ clientY, clientX }) => {
            const target = document.elementFromPoint(clientX, clientY),
              bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR);
            target === bodyElement &&
              ((this.header.blockInEditorSelected = !1),
              this.header.handleMouseLeave(),
              this.removeListener(document, "click", this.handleOutsideClick));
          };
          get isOpen() {
            return this.parentElement.hasAttribute("with-opened-dropdown");
          }
          get header() {
            return (0, utils_1.$el)("header-component");
          }
        }
        exports.HeaderFloatElement = HeaderFloatElement;
      },
      1279: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TooltipTrigger =
            exports.FloatElementBtn =
            exports.FloatElement =
            exports.DropdownOpener =
              void 0);
        var dropdown_opener_1 = __webpack_require__2(8510);
        Object.defineProperty(exports, "DropdownOpener", {
          enumerable: !0,
          get: function () {
            return dropdown_opener_1.DropdownOpener;
          },
        });
        var float_element_1 = __webpack_require__2(9448);
        Object.defineProperty(exports, "FloatElement", {
          enumerable: !0,
          get: function () {
            return float_element_1.FloatElement;
          },
        });
        var float_element_btn_1 = __webpack_require__2(3e3);
        Object.defineProperty(exports, "FloatElementBtn", {
          enumerable: !0,
          get: function () {
            return float_element_btn_1.FloatElementBtn;
          },
        });
        var tooltip_trigger_1 = __webpack_require__2(3254);
        Object.defineProperty(exports, "TooltipTrigger", {
          enumerable: !0,
          get: function () {
            return tooltip_trigger_1.TooltipTrigger;
          },
        });
      },
      6709: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.safePolygon =
            exports.getTarget =
            exports.destroyPolygon =
            exports.getChildren =
              void 0);
        const utils_1 = __webpack_require__2(4083);
        function getChildren(nodes, id) {
          let allChildren = nodes.filter(
              (node) => node.parentId === id && node.context?.open
            ),
            currentChildren = allChildren;
          for (; currentChildren.length; )
            (currentChildren = nodes.filter((node) =>
              currentChildren?.some(
                (n) => node.parentId === n.id && node.context?.open
              )
            )),
              (allChildren = allChildren.concat(currentChildren));
          return allChildren;
        }
        exports.getChildren = getChildren;
        function isPointInPolygon(point, polygon) {
          const [x, y] = point;
          let isInside2 = !1;
          const length = polygon.length;
          for (let i = 0, j = length - 1; i < length; j = i++) {
            const [xi, yi] = polygon[i] || [0, 0],
              [xj, yj] = polygon[j] || [0, 0];
            yi >= y != yj >= y &&
              x <= ((xj - xi) * (y - yi)) / (yj - yi) + xi &&
              (isInside2 = !isInside2);
          }
          return isInside2;
        }
        function isInside(point, rect) {
          return (
            point[0] >= rect.x &&
            point[0] <= rect.x + rect.width &&
            point[1] >= rect.y &&
            point[1] <= rect.y + rect.height
          );
        }
        const contains = (parent, child) =>
            !parent || !child ? !1 : parent.contains(child),
          isElement = (value) =>
            value
              ? value instanceof (document.defaultView || window).Element
              : !1,
          destroyPolygon = (polygonRef) => {
            polygonRef.current &&
              (polygonRef.current.remove(), (polygonRef.current = null));
          };
        exports.destroyPolygon = destroyPolygon;
        function getTarget(event) {
          return "composedPath" in event
            ? event.composedPath()[0]
            : event.target;
        }
        exports.getTarget = getTarget;
        const safePolygon = () => {
          let timeoutId,
            hasLanded = !1,
            lastX = null,
            lastY = null,
            lastCursorTime = performance.now();
          const requireIntent = !0;
          function getCursorSpeed(x, y) {
            const currentTime = performance.now(),
              elapsedTime = currentTime - lastCursorTime;
            if (lastX === null || lastY === null || elapsedTime === 0)
              return (
                (lastX = x), (lastY = y), (lastCursorTime = currentTime), null
              );
            const deltaX = x - lastX,
              deltaY = y - lastY,
              speed =
                Math.sqrt(deltaX * deltaX + deltaY * deltaY) / elapsedTime;
            return (
              (lastX = x), (lastY = y), (lastCursorTime = currentTime), speed
            );
          }
          return ({ x, y, placement, elements, onClose, nodeId, tree }) =>
            function (event) {
              function close() {
                clearTimeout(timeoutId), onClose();
              }
              if (
                (clearTimeout(timeoutId),
                !elements.domReference ||
                  !elements.floating ||
                  placement == null ||
                  x == null ||
                  y == null)
              )
                return;
              const { clientX, clientY } = event,
                clientPoint = [clientX, clientY],
                target = getTarget(event),
                isLeave = event.type === "mouseleave",
                isOverFloatingEl = contains(elements.floating, target),
                isOverReferenceEl = contains(elements.domReference, target),
                refRect = elements.domReference.getBoundingClientRect(),
                rect = elements.floating.getBoundingClientRect(),
                side = placement.split("-")[0],
                cursorLeaveFromRight = x > rect.right - rect.width / 2,
                cursorLeaveFromBottom = y > rect.bottom - rect.height / 2,
                isOverReferenceRect = isInside(clientPoint, refRect),
                isFloatingWider = rect.width > refRect.width,
                isFloatingTaller = rect.height > refRect.height,
                left = (isFloatingWider ? refRect : rect).left,
                right = (isFloatingWider ? refRect : rect).right,
                top = (isFloatingTaller ? refRect : rect).top,
                bottom = (isFloatingTaller ? refRect : rect).bottom;
              if (isOverFloatingEl && ((hasLanded = !0), !isLeave)) return;
              if (
                (isOverReferenceEl && (hasLanded = !1),
                isOverReferenceEl && !isLeave)
              ) {
                hasLanded = !0;
                return;
              }
              if (
                (isLeave &&
                  isElement(event.relatedTarget) &&
                  contains(elements.floating, event.relatedTarget)) ||
                (0, utils_1.$el)(
                  'float-element[aria-hidden="false"]',
                  elements.floating
                )
              )
                return;
              if (
                (side === "top" && y >= refRect.bottom - 1) ||
                (side === "bottom" && y <= refRect.top + 1) ||
                (side === "left" && x >= refRect.right - 1) ||
                (side === "right" && x <= refRect.left + 1)
              )
                return close();
              let rectPoly = [];
              switch (side) {
                case "top":
                  rectPoly = [
                    [left, refRect.top + 1],
                    [left, rect.bottom - 1],
                    [right, rect.bottom - 1],
                    [right, refRect.top + 1],
                  ];
                  break;
                case "bottom":
                  rectPoly = [
                    [left, rect.top + 1],
                    [left, refRect.bottom - 1],
                    [right, refRect.bottom - 1],
                    [right, rect.top + 1],
                  ];
                  break;
                case "left":
                  rectPoly = [
                    [rect.right - 1, bottom],
                    [rect.right - 1, top],
                    [refRect.left + 1, top],
                    [refRect.left + 1, bottom],
                  ];
                  break;
                case "right":
                  rectPoly = [
                    [refRect.right - 1, bottom],
                    [refRect.right - 1, top],
                    [rect.left + 1, top],
                    [rect.left + 1, bottom],
                  ];
                  break;
              }
              function getPolygon([x2, y2]) {
                switch (side) {
                  case "top": {
                    const cursorPointOne = [
                        isFloatingWider
                          ? x2 + 0.25
                          : cursorLeaveFromRight
                          ? x2 + 2
                          : x2 - 2,
                        y2 + 0.5 + 1,
                      ],
                      cursorPointTwo = [
                        isFloatingWider
                          ? x2 - 0.5 / 2
                          : cursorLeaveFromRight
                          ? x2 + 0.5 * 4
                          : x2 - 0.5 * 4,
                        y2 + 0.5 + 1,
                      ],
                      commonPoints = [
                        [
                          rect.left,
                          cursorLeaveFromRight || isFloatingWider
                            ? rect.bottom - 0.5
                            : rect.top,
                        ],
                        [
                          rect.right,
                          cursorLeaveFromRight
                            ? isFloatingWider
                              ? rect.bottom - 0.5
                              : rect.top
                            : rect.bottom - 0.5,
                        ],
                      ];
                    return [cursorPointOne, cursorPointTwo, ...commonPoints];
                  }
                  case "bottom": {
                    const cursorPointOne = [
                        isFloatingWider
                          ? x2 + 0.25
                          : cursorLeaveFromRight
                          ? x2 + 2
                          : x2 - 2,
                        y2 - 0.5,
                      ],
                      cursorPointTwo = [
                        isFloatingWider
                          ? x2 - 0.5 / 2
                          : cursorLeaveFromRight
                          ? x2 + 0.5 * 4
                          : x2 - 0.5 * 4,
                        y2 - 0.5,
                      ],
                      commonPoints = [
                        [
                          rect.left,
                          cursorLeaveFromRight || isFloatingWider
                            ? rect.top + 0.5
                            : rect.bottom,
                        ],
                        [
                          rect.right,
                          cursorLeaveFromRight
                            ? isFloatingWider
                              ? rect.top + 0.5
                              : rect.bottom
                            : rect.top + 0.5,
                        ],
                      ];
                    return [cursorPointOne, cursorPointTwo, ...commonPoints];
                  }
                  case "left": {
                    const cursorPointOne = [
                        x2 + 0.5 + 1,
                        isFloatingTaller
                          ? y2 + 0.25
                          : cursorLeaveFromBottom
                          ? y2 + 2
                          : y2 - 2,
                      ],
                      cursorPointTwo = [
                        x2 + 0.5 + 1,
                        isFloatingTaller
                          ? y2 - 0.5 / 2
                          : cursorLeaveFromBottom
                          ? y2 + 0.5 * 4
                          : y2 - 0.5 * 4,
                      ];
                    return [
                      ...[
                        [
                          cursorLeaveFromBottom || isFloatingTaller
                            ? rect.right - 0.5
                            : rect.left,
                          rect.top,
                        ],
                        [
                          cursorLeaveFromBottom
                            ? isFloatingTaller
                              ? rect.right - 0.5
                              : rect.left
                            : rect.right - 0.5,
                          rect.bottom,
                        ],
                      ],
                      cursorPointOne,
                      cursorPointTwo,
                    ];
                  }
                  case "right": {
                    const cursorPointOne = [
                        x2 - 0.5,
                        isFloatingTaller
                          ? y2 + 0.25
                          : cursorLeaveFromBottom
                          ? y2 + 2
                          : y2 - 2,
                      ],
                      cursorPointTwo = [
                        x2 - 0.5,
                        isFloatingTaller
                          ? y2 - 0.5 / 2
                          : cursorLeaveFromBottom
                          ? y2 + 0.5 * 4
                          : y2 - 0.5 * 4,
                      ],
                      commonPoints = [
                        [
                          cursorLeaveFromBottom || isFloatingTaller
                            ? rect.left + 0.5
                            : rect.right,
                          rect.top,
                        ],
                        [
                          cursorLeaveFromBottom
                            ? isFloatingTaller
                              ? rect.left + 0.5
                              : rect.right
                            : rect.left + 0.5,
                          rect.bottom,
                        ],
                      ];
                    return [cursorPointOne, cursorPointTwo, ...commonPoints];
                  }
                }
              }
              if (!isPointInPolygon([clientX, clientY], rectPoly)) {
                if (hasLanded && !isOverReferenceRect) return close();
                if (!isLeave && requireIntent) {
                  const cursorSpeed = getCursorSpeed(
                    event.clientX,
                    event.clientY
                  );
                  if (cursorSpeed !== null && cursorSpeed < 0.1) return close();
                }
                isPointInPolygon([clientX, clientY], getPolygon([x, y]))
                  ? !hasLanded &&
                    requireIntent &&
                    (timeoutId = window.setTimeout(close, 40))
                  : close();
              }
            };
        };
        exports.safePolygon = safePolygon;
      },
      3254: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TooltipTrigger = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083);
        class TooltipTrigger extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "mouseenter", this.handleMouseEnter),
              this.addListener(this, "mouseleave", this.handleMouseLeave);
          }
          handleMouseEnter = () => {
            (0, utils_1.$el)(`#${this.dataset.floatElementId}`)?.show();
          };
          handleMouseLeave = () => {
            (0, utils_1.$el)(`#${this.dataset.floatElementId}`)?.hide();
          };
          setExpand(isExpanded) {
            this.setAttribute(
              "data-aria-expanded",
              isExpanded ? "true" : "false"
            );
          }
        }
        exports.TooltipTrigger = TooltipTrigger;
      },
      9099: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.FreeShippingBar = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          PROGRESS_BAR_DOTS = "[data-free-shipping-progress-bar-dots]",
          MESSAGE_NODE_SELECTOR = "[data-free-shipping-bar-message]",
          DIFFERENCE_ATTRIBUTE = "data-free-shipping-difference",
          DIFFERENCE_PERCENT_ATTRIBUTE =
            "data-free-shipping-difference-percent",
          PROGRESS_MESSAGE_ATTRIBUTE = "data-progress-message",
          ACHIEVED_MESSAGE_ATTRIBUTE = "data-achieved-message";
        class FreeShippingBar extends base_component_1.BaseComponent {
          constructor() {
            super(),
              this.updateProgressByDifference(
                this.getAttribute(DIFFERENCE_ATTRIBUTE),
                +this.getAttribute(DIFFERENCE_PERCENT_ATTRIBUTE)
              );
          }
          updateProgressByDifference(difference, differencePercent) {
            const progressMessage =
                this.getAttribute(PROGRESS_MESSAGE_ATTRIBUTE) ?? "",
              achievedMessage =
                this.getAttribute(ACHIEVED_MESSAGE_ATTRIBUTE) ?? "";
            differencePercent < 100
              ? (this.setText(progressMessage.replace("[value]", difference)),
                this.setProgress(differencePercent))
              : (this.setText(achievedMessage), this.setProgress(100));
          }
          setProgress = (value) => {
            const dots = (0, utils_1.$el)(PROGRESS_BAR_DOTS, this);
            dots &&
              dots.setAttribute(
                "style",
                `--gsc-freeshipping-bar-percent: ${value}%`
              );
          };
          setText = (text) => {
            (0, utils_1.$el)(MESSAGE_NODE_SELECTOR, this)?.replaceChildren(
              text
            );
          };
        }
        exports.FreeShippingBar = FreeShippingBar;
      },
      8430: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.FreeShippingBar = void 0);
        var free_shipping_bar_1 = __webpack_require__2(9099);
        Object.defineProperty(exports, "FreeShippingBar", {
          enumerable: !0,
          get: function () {
            return free_shipping_bar_1.FreeShippingBar;
          },
        });
      },
      1027: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SearchField = exports.PasswordField = void 0);
        var password_input_1 = __webpack_require__2(2710);
        Object.defineProperty(exports, "PasswordField", {
          enumerable: !0,
          get: function () {
            return password_input_1.PasswordField;
          },
        });
        var search_input_1 = __webpack_require__2(3820);
        Object.defineProperty(exports, "SearchField", {
          enumerable: !0,
          get: function () {
            return search_input_1.SearchField;
          },
        });
      },
      2710: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PasswordField = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          INPUT_SELECTOR = "[data-password-field-input]",
          BUTTON_SELECTOR = "[data-password-field-button]";
        class PasswordField extends base_component_1.BaseComponent {
          mountComponent() {
            const button = (0, utils_1.$el)(BUTTON_SELECTOR, this);
            this.addListener(button, "click", this.handleButtonClick);
          }
          handleButtonClick = (event) => {
            event.preventDefault(), this.togglePasswordVisible();
          };
          togglePasswordVisible() {
            const input = (0, utils_1.$el)(INPUT_SELECTOR, this);
            if (input) {
              const isHidden = input.getAttribute("type") === "password";
              input.setAttribute("type", isHidden ? "text" : "password"),
                this.setHiddenButton(isHidden);
            }
          }
          setHiddenButton(isHidden) {
            (0, utils_1.$el)(BUTTON_SELECTOR, this)?.toggleAttribute(
              "password-visible",
              isHidden
            );
          }
        }
        exports.PasswordField = PasswordField;
      },
      3820: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SearchField = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          INPUT_SELECTOR = "[data-search-field-input]",
          RESET_BTN_SELECTOR = "[data-search-field-reset-button]";
        class SearchField extends base_component_1.BaseComponent {
          mountComponent() {
            const resetButton = (0, utils_1.$el)(RESET_BTN_SELECTOR, this),
              input = (0, utils_1.$el)(INPUT_SELECTOR, this);
            this.addListener(input, "input", this.handleInputChange),
              this.addListener(window, "click", this.handleWindowClick),
              this.addListener(
                resetButton,
                "click",
                this.handleResetButtonClick
              );
          }
          handleWindowClick = (event) => {
            const input = (0, utils_1.$el)(INPUT_SELECTOR, this),
              target = event.target,
              isInputChild = (0, utils_1.$elParent)("search-input", target);
            !(input === target) &&
              !isInputChild &&
              this.updateResetButtonVisible();
          };
          handleInputChange = () => {
            this.updateResetButtonVisible();
          };
          handleResetButtonClick = (event) => {
            event.preventDefault(), this.reset();
          };
          reset() {
            const input = (0, utils_1.$el)(INPUT_SELECTOR, this);
            input &&
              ((input.value = ""),
              input.dispatchEvent(new Event("input", { bubbles: !0 })),
              input.focus());
          }
          updateResetButtonVisible() {
            const resetButton = (0, utils_1.$el)(RESET_BTN_SELECTOR, this);
            resetButton &&
              resetButton.classList.toggle("hidden", !this.hasInputValue());
          }
          hasInputValue() {
            const input = (0, utils_1.$el)(INPUT_SELECTOR, this);
            return input ? input.value.trim().length > 0 : !1;
          }
          get value() {
            const input = (0, utils_1.$el)(INPUT_SELECTOR, this);
            return input ? input.value : "";
          }
        }
        exports.SearchField = SearchField;
      },
      758: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.LocalizationSelector = void 0);
        var localization_selector_1 = __webpack_require__2(9076);
        Object.defineProperty(exports, "LocalizationSelector", {
          enumerable: !0,
          get: function () {
            return localization_selector_1.LocalizationSelector;
          },
        });
      },
      9076: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.LocalizationSelector = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          INPUT_SELECTOR = "[data-localization-input]",
          FORM_SELECTOR = "form",
          SEARCH_FIELD_SELECTOR = "[data-localization-search-field]",
          COUNTRY_SELECTOR = "data-country",
          RESET_BTN_SELECTOR = "[data-search-field-reset-button]";
        class LocalizationSelector extends base_component_1.BaseComponent {
          labels;
          resetButton;
          mountComponent() {
            this.addListener(this, "click", this.handleClick);
            const searchField = (0, utils_1.$el)(SEARCH_FIELD_SELECTOR, this);
            searchField &&
              (this.addListener(searchField, "input", this.handleSearchInput),
              (this.labels = (0, utils_1.$list)(`[${COUNTRY_SELECTOR}]`, this)),
              (this.resetButton = (0, utils_1.$el)(RESET_BTN_SELECTOR, this)),
              this.addListener(
                this.resetButton,
                "click",
                this.handleResetButtonClick
              ));
          }
          handleSearchInput = ({ target }) => {
            this.labels.forEach((label) => {
              label.classList.toggle(
                "hidden",
                !label
                  .getAttribute(COUNTRY_SELECTOR)
                  .toLowerCase()
                  .startsWith(target.value.toLowerCase())
              );
            }),
              this.resetButton.classList.toggle("hidden", !target.value.length);
          };
          handleResetButtonClick = () => {
            const input = (0, utils_1.$el)(SEARCH_FIELD_SELECTOR, this);
            (input.value = ""),
              input.dispatchEvent(new Event("input", { bubbles: !0 })),
              input.focus();
          };
          handleClick = (event) => {
            event.preventDefault();
            const item = event.target.closest("[data-localization-item]");
            if (item) {
              const input = (0, utils_1.$el)(INPUT_SELECTOR, this),
                form = (0, utils_1.$el)(FORM_SELECTOR, this);
              if (!input || !form || !item.dataset.value) return;
              (input.value = item.dataset.value),
                form.submit(),
                this.closest("float-element").hide();
            }
          };
        }
        exports.LocalizationSelector = LocalizationSelector;
      },
      436: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.MaxLinesComponent = void 0);
        var max_lines_component_1 = __webpack_require__2(7039);
        Object.defineProperty(exports, "MaxLinesComponent", {
          enumerable: !0,
          get: function () {
            return max_lines_component_1.MaxLinesComponent;
          },
        });
      },
      7039: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.MaxLinesComponent = void 0);
        const base_component_1 = __webpack_require__2(3608),
          debounce_1 = __webpack_require__2(2731),
          utils_1 = __webpack_require__2(4083),
          LINE_CLAMP_SELECTOR = "[data-quote-line-clamp]",
          TARGET_SELECTOR = "[data-quote-line-clamp-target]";
        class MaxLinesComponent extends base_component_1.BaseComponent {
          resizeObserver;
          mountComponent() {
            (this.resizeObserver = new ResizeObserver(this.handleResize)),
              this.resizeObserver.observe(this);
          }
          unmountComponent() {
            this.resizeObserver.disconnect();
          }
          handleResize = (0, debounce_1.debounce)(() => {
            this.offsetHeight > 0 && this.update();
          }, 100);
          update() {
            const lineClamp = (0, utils_1.$el)(LINE_CLAMP_SELECTOR, this),
              target = (0, utils_1.$el)(TARGET_SELECTOR, this);
            if (!lineClamp || !target) return;
            const heightContainer = (0, utils_1.$el)(
                "[data-quote-height]",
                this
              ),
              styles = getComputedStyle(target),
              lineHeight = parseFloat(styles.lineHeight),
              height = lineClamp.offsetHeight,
              containerHeight = heightContainer?.offsetHeight ?? height,
              diff = (containerHeight - height) / lineHeight;
            let maxLines = Math.floor(height / lineHeight);
            diff > 2 &&
              ((maxLines = Math.floor(containerHeight / lineHeight)),
              (lineClamp.style.maxHeight = `${containerHeight}px`)),
              (target.style["-webkit-line-clamp"] = maxLines),
              (target.style.height = `${maxLines * lineHeight}px`),
              this.setAttribute("data-line-clamp-setter-is-ready", ""),
              this.emit("linesSetted", { target });
          }
        }
        exports.MaxLinesComponent = MaxLinesComponent;
      },
      1181: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ModalButton = exports.ModalComponent = void 0);
        var modal_1 = __webpack_require__2(2549);
        Object.defineProperty(exports, "ModalComponent", {
          enumerable: !0,
          get: function () {
            return modal_1.ModalComponent;
          },
        });
        var modal_button_1 = __webpack_require__2(467);
        Object.defineProperty(exports, "ModalButton", {
          enumerable: !0,
          get: function () {
            return modal_button_1.ModalButton;
          },
        });
      },
      467: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ModalButton = void 0);
        const base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          utils_1 = __webpack_require__2(4083);
        class ModalButton extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "keydown", this.handleKeyDown),
              this.addListener(this, "click", this.handleButtonClick);
          }
          handleButtonClick = (event) => {
            event.preventDefault(), this.trigger();
          };
          handleKeyDown = (event) => {
            (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.trigger());
          };
          trigger() {
            const modal = (0, utils_1.$el)(this.dataset.modal, document);
            if (modal)
              switch (this.dataset.action) {
                case "close":
                  modal.hide();
                  return;
                case "open":
                  modal.show();
                  return;
                case "toggle":
                  modal.toggle();
                  return;
              }
            this.emit("click", {});
          }
        }
        exports.ModalButton = ModalButton;
      },
      2549: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ModalComponent = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          key_1 = __webpack_require__2(9650),
          dom_1 = __webpack_require__2(3889),
          BODY_ELEMENT_SELECTOR = "body-element";
        class ModalComponent extends base_component_1.BaseComponent {
          element;
          isOpen;
          withOutsideClick;
          skipTransitionWait;
          constructor() {
            super(),
              (this.element = (0, dom_1.getTemplateFirstChild)(
                (0, utils_1.$el)(`[data-modal-template="${this.id}"]`, this)
              )),
              (this.withOutsideClick = this.hasAttribute(
                "data-with-close-on-outside"
              )),
              (this.skipTransitionWait = this.hasAttribute(
                "data-skip-transition-wait"
              ));
          }
          mountComponent() {
            super.mountComponent(),
              this.withOutsideClick &&
                this.addListener(window, "click", this.handleOutsideClick),
              this.isEditor && (this.isSection || this.hide(!0));
          }
          handleModalFocusout = (event) => {
            const bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR),
              focusTarget = event.relatedTarget,
              isLastOpenedWindow = bodyElement.isLastOpenedWindow(this.id);
            if (
              (!focusTarget || !this.contains(focusTarget)) &&
              isLastOpenedWindow &&
              bodyElement.isUsingKeyboard
            ) {
              const { firstTarget } = (0, utils_1.getTargets)(this.element);
              firstTarget.focus();
            }
          };
          handleKeydown = (event) => {
            !this.hasAttribute("data-ignore-esc-key") &&
              (0, key_1.isEscKey)(event) &&
              (event.preventDefault(), this.hide());
          };
          handleOutsideClick = (event) => {
            (0, utils_1.$elParent)(BODY_ELEMENT_SELECTOR, event.target) &&
              this.isOpen &&
              this.hide();
          };
          async show() {
            const bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR);
            if (
              ((0, utils_1.whenDefined)("body-element").then(() => {
                bodyElement.addDialogWindow(this.id);
              }),
              this.mount(),
              await this.setOpenState(!0),
              this.skipTransitionWait ||
                (await (0, utils_1.transitionToPromise)(this)),
              (0, utils_1.$list)("video[autoplay]", this.element)?.forEach(
                (video) => {
                  video.play();
                }
              ),
              window.self === window.top)
            ) {
              const { firstTarget } = (0, utils_1.getTargets)(this.element);
              firstTarget?.focus();
            }
            this.addListener(this, "focusout", this.handleModalFocusout),
              this.addListener(window, "keydown", this.handleKeydown),
              this.emit("show", {});
          }
          async hide(isInstant) {
            const bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR);
            (0, utils_1.whenDefined)("body-element").then(() => {
              bodyElement.removeDialogWindow(this.id);
            }),
              this.removeListener(window, "keydown", this.handleKeydown),
              this.removeListener(this, "focusout", this.handleModalFocusout),
              await this.setOpenState(!1),
              this.skipTransitionWait || isInstant
                ? this.unmount()
                : (await (0, utils_1.transitionToPromise)(this),
                  this.unmount()),
              this.emit("hide", {});
          }
          async toggle() {
            this.isOpen ? this.hide() : this.show();
          }
          mount() {
            this.replaceChildren(this.element);
          }
          unmount() {
            this.replaceChildren();
          }
          async setOpenState(isOpen) {
            if (
              ((this.isOpen = isOpen), this.hasAttribute("data-with-overlay"))
            ) {
              const bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR),
                isImportant = this.hasAttribute("data-overlay-important"),
                hasCustomOpacity = this.hasAttribute("data-overlay-opacity");
              let styles = {};
              isImportant &&
                (styles = {
                  ...styles,
                  zIndex: parseFloat(getComputedStyle(this).zIndex) - 1,
                }),
                hasCustomOpacity &&
                  (styles = {
                    ...styles,
                    "--gsc-overlay-opacity": +this.getAttribute(
                      "data-overlay-opacity"
                    ),
                  }),
                (0, utils_1.whenDefined)("body-element").then(() => {
                  isOpen
                    ? bodyElement.showOverlay(this.id, styles)
                    : bodyElement.hideOverlay(this.id),
                    this.setVisible(isOpen);
                });
            } else this.setVisible(isOpen);
          }
          setVisible(isOpened) {
            this.classList.toggle("is-opened", isOpened);
          }
          get isSection() {
            return this.hasAttribute("is-section");
          }
        }
        exports.ModalComponent = ModalComponent;
      },
      4061: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.NotificationComponent = void 0);
        var notification_component_1 = __webpack_require__2(8190);
        Object.defineProperty(exports, "NotificationComponent", {
          enumerable: !0,
          get: function () {
            return notification_component_1.NotificationComponent;
          },
        });
      },
      8190: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.NotificationComponent = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          CLOSE_BUTTON_SELECTOR = "[data-notification-close-button]",
          NOTIFICATION_ALERT_SELECTOR = "[data-notification-alert]",
          ALERT_TEXT_SELECTOR = "[data-notification-alert-text]",
          SCREEN_READER_ALERT_TEXT_SELECTOR =
            "[data-notification-screen-reader-alert-text]";
        class NotificationComponent extends base_component_1.BaseComponent {
          showTimeoutId;
          mountComponent() {
            this.addListener(this, "click", this.handleClick);
          }
          unmountComponent() {
            clearTimeout(this.showTimeoutId);
          }
          handleClick = (event) => {
            event.preventDefault(),
              (0, utils_1.$elParent)(CLOSE_BUTTON_SELECTOR, event.target) &&
                this.hide();
          };
          show(errorText, variant = "warning", duration = 3e3) {
            this.setAlert(errorText, variant),
              this.showTimeoutId && clearTimeout(this.showTimeoutId),
              this.setVisible(!0),
              (this.showTimeoutId = setTimeout(() => {
                this.setVisible(!1);
              }, duration));
          }
          hide() {
            this.setVisible(!1);
          }
          setVisible(isVisible) {
            this.classList.toggle("is-visible", isVisible);
          }
          setAlert(errorText, variant) {
            const alert = (0, utils_1.$el)(NOTIFICATION_ALERT_SELECTOR, this),
              text = (0, utils_1.$el)(ALERT_TEXT_SELECTOR, this),
              screenReaderText = (0, utils_1.$el)(
                SCREEN_READER_ALERT_TEXT_SELECTOR,
                this
              );
            alert &&
              text &&
              (alert.setAttribute("alert-type", variant),
              (text.innerHTML = errorText),
              (screenReaderText.innerHTML = errorText));
          }
        }
        exports.NotificationComponent = NotificationComponent;
      },
      6504: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PaginationLoadButton =
            exports.PaginationLink =
            exports.PaginationInfiniteScroll =
            exports.PaginationComponent =
              void 0);
        var pagination_1 = __webpack_require__2(3223);
        Object.defineProperty(exports, "PaginationComponent", {
          enumerable: !0,
          get: function () {
            return pagination_1.PaginationComponent;
          },
        });
        var pagination_infinite_scroll_1 = __webpack_require__2(7330);
        Object.defineProperty(exports, "PaginationInfiniteScroll", {
          enumerable: !0,
          get: function () {
            return pagination_infinite_scroll_1.PaginationInfiniteScroll;
          },
        });
        var pagination_link_1 = __webpack_require__2(1668);
        Object.defineProperty(exports, "PaginationLink", {
          enumerable: !0,
          get: function () {
            return pagination_link_1.PaginationLink;
          },
        });
        var pagination_load_button_1 = __webpack_require__2(9553);
        Object.defineProperty(exports, "PaginationLoadButton", {
          enumerable: !0,
          get: function () {
            return pagination_load_button_1.PaginationLoadButton;
          },
        });
      },
      7330: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PaginationInfiniteScroll = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          PRELOADER_SELECTOR = ".loading-spinner",
          INTERSECTION_OBSERVER_OPTIONS = {
            root: null,
            rootMargin: "0px 0px 200px 0px",
          };
        class PaginationInfiniteScroll extends base_component_1.BaseComponent {
          intersectionObserver;
          mountComponent() {
            (this.intersectionObserver = new IntersectionObserver(
              this.handleIntersectionObserve,
              INTERSECTION_OBSERVER_OPTIONS
            )),
              this.intersectionObserver.observe(this);
          }
          unmountComponent() {
            this.intersectionObserver.disconnect();
          }
          handleIntersectionObserve = (entries) => {
            const preloader = (0, utils_1.$el)(PRELOADER_SELECTOR, this),
              url = this.dataset.url;
            if (url) {
              if (!entries[0].isIntersecting) return;
              this.intersectionObserver.unobserve(this),
                preloader.classList.remove("hidden"),
                fetch(url)
                  .then((response) => response.text())
                  .then((responseText) => {
                    const html = (0, dom_1.parseHTML)(responseText),
                      pagination = (0, utils_1.$elParent)(
                        "pagination-component",
                        this
                      );
                    preloader.classList.add("hidden"),
                      this.updateFromHTML(html),
                      pagination && pagination.updateTargetsFromHTML(html);
                  })
                  .catch(() => {
                    console.log("Error in infinite scroll component");
                  });
            }
          };
          updateFromHTML(html) {
            const newPagination = (0, utils_1.$el)(
              "pagination-infinite-scroll",
              html
            );
            newPagination
              ? (this.setPaginationUrl(newPagination.dataset.url),
                this.intersectionObserver.observe(this))
              : this.removeAttribute("data-url");
          }
          setPaginationUrl(url) {
            this.dataset.url = url;
          }
        }
        exports.PaginationInfiniteScroll = PaginationInfiniteScroll;
      },
      1668: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PaginationLink = void 0);
        const base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          PAGINATION_COMPONENT_SELECTOR = "pagination-component";
        class PaginationLink extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "keydown", this.handleKeyDown),
              this.addListener(this, "click", this.handleLinkClick);
          }
          handleLinkClick = (event) => {
            event.preventDefault(), this.fetchResults();
          };
          handleKeyDown = (event) => {
            (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.fetchResults());
          };
          fetchResults() {
            const pagination = (0, utils_1.$elParent)(
                PAGINATION_COMPONENT_SELECTOR,
                this
              ),
              url = this.dataset.url;
            pagination && url && this.getFromUrl(url);
          }
          getFromUrl(url) {
            const pagination = (0, utils_1.$elParent)(
              PAGINATION_COMPONENT_SELECTOR,
              this
            );
            pagination &&
              (pagination.loadingOverlay.classList.remove("hidden"),
              fetch(url)
                .then((response) => response.text())
                .then((responseText) => {
                  pagination.loadingOverlay.classList.add("hidden"),
                    this.updatePaginationFromHTML(
                      (0, dom_1.parseHTML)(responseText)
                    ),
                    history.pushState({ searchParams: url }, "", url);
                })
                .catch(() => {
                  console.log("Error in pagination link component");
                }));
          }
          updatePaginationFromHTML(html) {
            const pagination = (0, utils_1.$elParent)(
              PAGINATION_COMPONENT_SELECTOR,
              this
            );
            pagination &&
              (pagination.updateResultsFromHTML(html),
              pagination.updateFromHTML(html));
          }
        }
        exports.PaginationLink = PaginationLink;
      },
      9553: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PaginationLoadButton = void 0);
        const base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          PAGINATION_COMPONENT_SELECTOR = "pagination-component",
          PAGINATION_LOAD_BUTTON_SELECTOR = "pagination-load-button";
        class PaginationLoadButton extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "keydown", this.handleKeyDown),
              this.addListener(this, "click", this.handleButtonClick);
          }
          handleButtonClick = (event) => {
            event.preventDefault(), this.fetchResults();
          };
          handleKeyDown = (event) => {
            (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.fetchResults());
          };
          fetchResults() {
            this.dataset.url &&
              (this.setLoading(!0),
              fetch(this.dataset.url)
                .then((response) => response.text())
                .then((responseText) => {
                  const html = (0, dom_1.parseHTML)(responseText);
                  this.setLoading(!1),
                    this.updateFromHTML(html),
                    this.updatePaginationFromHTML(html);
                })
                .catch(() => {
                  console.log("Error in pagination load button component");
                }));
          }
          updatePaginationFromHTML(html) {
            const pagination = (0, utils_1.$elParent)(
              PAGINATION_COMPONENT_SELECTOR,
              this
            );
            pagination?.updateTargetsFromHTML(html),
              pagination?.updateFromHTML(html);
          }
          setPaginationUrl(newUrl) {
            this.dataset.url = newUrl;
          }
          removePagination() {
            (0, utils_1.$elParent)(
              PAGINATION_COMPONENT_SELECTOR,
              this
            )?.remove();
          }
          updateFromHTML(html) {
            const newBtn = (0, utils_1.$el)(
              PAGINATION_LOAD_BUTTON_SELECTOR,
              html
            );
            newBtn
              ? this.setPaginationUrl(newBtn.dataset.url)
              : this.removePagination();
          }
          setLoading(isLoading) {
            this.toggleAttribute("disabled", isLoading),
              this.classList.toggle("loading", isLoading);
          }
        }
        exports.PaginationLoadButton = PaginationLoadButton;
      },
      3223: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PaginationComponent = void 0);
        const utils_1 = __webpack_require__2(4083),
          dom_1 = __webpack_require__2(3889),
          base_component_1 = __webpack_require__2(3608),
          PAGINATION_COMPONENT_SELECTOR = "pagination-component";
        class PaginationComponent extends base_component_1.BaseComponent {
          updateTargetsFromHTML(html) {
            if (!this.dataset.containerId) return;
            const newResults = (0, utils_1.$el)(
                `#${this.dataset.containerId}`,
                html
              ),
              results = (0, utils_1.$el)(`#${this.dataset.containerId}`);
            if (newResults && results) {
              const targets = (0, utils_1.$list)(
                  `.${this.dataset.target}`,
                  newResults
                ),
                fragment = document.createDocumentFragment();
              targets.forEach((target) => {
                fragment.appendChild(target);
              }),
                results.appendChild(fragment);
              const firstNewTarget = targets[0];
              if (firstNewTarget) {
                const { firstTarget } = (0, utils_1.getTargets)(firstNewTarget);
                firstTarget?.focus();
              }
            }
          }
          updateResultsFromHTML(html) {
            if (!this.dataset.containerId) return;
            const newResults = (0, utils_1.$el)(
                `#${this.dataset.containerId}`,
                html
              ),
              results = (0, utils_1.$el)(`#${this.dataset.containerId}`);
            newResults &&
              results &&
              (results.parentNode.replaceChild(newResults, results),
              (0, utils_1.isNotThemeStore)() &&
                newResults.scrollIntoView({ behavior: "smooth" }));
          }
          updateFromHTML(html) {
            const newPagination = (0, utils_1.$el)(
              PAGINATION_COMPONENT_SELECTOR,
              html
            );
            (0, dom_1.replaceNodeChildren)(this, newPagination);
          }
          get loadingOverlay() {
            return (0, utils_1.$el)(`#${this.dataset.overlayId}`);
          }
        }
        exports.PaginationComponent = PaginationComponent;
      },
      4710: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.QuantityBtn = exports.QuantityComponent = void 0);
        var quantity_1 = __webpack_require__2(1176);
        Object.defineProperty(exports, "QuantityComponent", {
          enumerable: !0,
          get: function () {
            return quantity_1.QuantityComponent;
          },
        });
        var quantity_btn_1 = __webpack_require__2(9535);
        Object.defineProperty(exports, "QuantityBtn", {
          enumerable: !0,
          get: function () {
            return quantity_btn_1.QuantityBtn;
          },
        });
      },
      9535: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.QuantityBtn = void 0);
        const base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          utils_1 = __webpack_require__2(4083),
          QUANTITY_COMPONENT = "quantity-component";
        class QuantityBtn extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "click", this.handleButtonClick),
              this.addListener(this, "keydown", this.handleKeyDown);
          }
          handleButtonClick = (event) => {
            event.preventDefault(), this.update();
          };
          handleKeyDown = (event) => {
            const target = event.target;
            (0, key_1.isEnterKey)(event) &&
              !target.hasAttribute("disabled") &&
              (event.preventDefault(), this.update());
          };
          update() {
            const quantity = (0, utils_1.$elParent)(QUANTITY_COMPONENT, this),
              action = this.dataset.action;
            quantity &&
              action &&
              (quantity.inputChange(action),
              action === "minus" && this.setDisabled());
          }
          setDisabled() {
            const quantity = (0, utils_1.$elParent)(QUANTITY_COMPONENT, this);
            this.toggleAttribute("disabled", quantity?.input?.value === "1");
          }
        }
        exports.QuantityBtn = QuantityBtn;
      },
      1176: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.QuantityComponent = void 0);
        const base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          utils_1 = __webpack_require__2(4083),
          INPUT_SELECTOR = "[data-quantity-input]";
        class QuantityComponent extends base_component_1.BaseComponent {
          input;
          prevValue;
          stockValue;
          constructor() {
            super(),
              (this.input = (0, utils_1.$el)(INPUT_SELECTOR, this)),
              (this.prevValue = this.value),
              (this.stockValue = this.dataset.stock || "0");
          }
          mountComponent() {
            this.updateButtonsDisable(),
              this.addListener(this.input, "keypress", this.handleKeydown),
              this.addListener(this.input, "input", this.handleInput),
              this.addListener(this.input, "blur", this.handleBlur);
          }
          handleBlur = (event) => {
            if (this.input) {
              const value = event.target.value || "0";
              (this.input.value = value),
                this.updateButtonsDisable(),
                (this.prevValue = value);
            }
          };
          handleKeydown = (event) => {
            this.input &&
              (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.input.blur());
          };
          handleInput = (event) => {
            if (this.input) {
              const value = event.target.value;
              (this.input.value = this.isMoreThanStock
                ? this.stockValue
                : value),
                this.updateButtonsDisable(),
                (this.prevValue = value);
            }
          };
          inputChange(action) {
            this.input &&
              (action === "minus" ? this.input.stepDown() : this.input.stepUp(),
              +this.prevValue != +this.value &&
                this.input.dispatchEvent(new Event("change", { bubbles: !0 })),
              this.updateButtonsDisable());
          }
          updateButtonsDisable() {
            this.updateButtonDisabled("minus", this.isLessThanMin),
              this.updateButtonDisabled("plus", this.isMoreThanStock);
          }
          setDisable(isDisabled) {
            this.updateButtonDisabled("minus", isDisabled),
              this.updateButtonDisabled("plus", isDisabled);
          }
          updateButtonDisabled(btnType, isDisabled) {
            (0, utils_1.$el)(
              `quantity-btn[data-action="${btnType}"]`,
              this
            )?.toggleAttribute("disabled", isDisabled);
          }
          get value() {
            return this.input ? this.input.value : "0";
          }
          get isLessThanMin() {
            return this.input ? +this.value <= +this.input.min : !1;
          }
          get isMoreThanStock() {
            return +this.value >= +this.stockValue;
          }
        }
        exports.QuantityComponent = QuantityComponent;
      },
      1030: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.QuoteComponent = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889);
        class QuoteComponent extends base_component_1.BaseComponent {
          sidebarButtonSelector;
          quoteLinkAttribute;
          quoteProductLinkAttribute;
          quoteLinkTemplateAttribute;
          targetAttribute;
          quoteWithProductClass;
          quoteLink;
          quoteProductLink;
          quoteLinkTemplate;
          sidebarButton;
          target;
          constructor() {
            super(),
              (this.sidebarButtonSelector = "sidebar-button"),
              (this.quoteLinkAttribute = "[data-quote-link]"),
              (this.quoteProductLinkAttribute = "[data-quote-product-link]"),
              (this.quoteLinkTemplateAttribute = "[data-quote-link-template]"),
              (this.targetAttribute = "[data-quote-line-clamp-target]"),
              (this.quoteWithProductClass = "quote--with-product-link"),
              (this.quoteLink = this.querySelector(this.quoteLinkAttribute)),
              (this.quoteProductLink = this.querySelector(
                this.quoteProductLinkAttribute
              )),
              (this.quoteLinkTemplate = this.querySelector(
                this.quoteLinkTemplateAttribute
              )),
              (this.sidebarButton = this.closest(this.sidebarButtonSelector)),
              (this.target = this.querySelector(this.targetAttribute));
          }
          connectedCallback() {
            this.quoteProductLink && this.target && this.setLinks();
          }
          setLinks = () => {
            const targetHeight = this.target.offsetHeight;
            if (!(this.target.firstElementChild.offsetHeight > targetHeight)) {
              if (this.quoteLink)
                this.quoteLink.href = this.quoteProductLink.href;
              else {
                const clone = (0, dom_1.getTemplateFirstChild)(
                  this.quoteLinkTemplate
                );
                (clone.href = this.quoteProductLink?.href),
                  this.appendChild(clone);
              }
              this.sidebarButton && this.sidebarButton.destroyListeners(),
                this.classList.add(this.quoteWithProductClass);
            }
          };
        }
        exports.QuoteComponent = QuoteComponent;
      },
      7317: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ShapeSwatch = void 0);
        var shape_swatch_1 = __webpack_require__2(7922);
        Object.defineProperty(exports, "ShapeSwatch", {
          enumerable: !0,
          get: function () {
            return shape_swatch_1.ShapeSwatch;
          },
        });
      },
      7922: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ShapeSwatch = void 0);
        const utils_1 = __webpack_require__2(4083),
          color_1 = __webpack_require__2(7734),
          base_component_1 = __webpack_require__2(3608),
          SWATCH_SELECTOR = ".color-swatch";
        class ShapeSwatch extends base_component_1.BaseComponent {
          element;
          constructor() {
            super(),
              (this.element = (0, utils_1.$el)(SWATCH_SELECTOR, this) || this),
              this.setValue();
          }
          setValue() {
            if (this.hasAttribute("is-image")) return;
            const selectedValue = this.dataset.color.toLowerCase().trim(),
              patterns = this.dataset.colorsPatterns.split(`
`);
            this.isColor(selectedValue) ||
              this.element.setAttribute("not-valid", ""),
              this.setPropertyValue(selectedValue),
              patterns.forEach((pattern) => {
                const config = pattern.split("::"),
                  patternLabel = config[0],
                  patternValue = config[1];
                if (patternLabel.toLowerCase().trim() === selectedValue) {
                  this.setPropertyValue(patternValue);
                  return;
                }
              });
          }
          getGradientValue(colors) {
            let gradientValue = "90deg, ",
              notValidColor = 0;
            const preparedPatterns = this.dataset.colorsPatterns
              .split(
                `
`
              )
              .reduce((acc, pattern) => {
                const config = pattern.split("::"),
                  patternLabel = config[0],
                  patternValue = config[1],
                  patternLabelDowncase = patternLabel.toLowerCase().trim();
                return { ...acc, [patternLabelDowncase]: patternValue };
              }, {});
            return (
              colors.forEach((gradientColor, index) => {
                const percent = 100 / colors.length;
                let color = gradientColor.toLowerCase();
                preparedPatterns[color]
                  ? (color = preparedPatterns[color])
                  : this.isColor(color) ||
                    ((color = "white"), (notValidColor += 1));
                const startPoint = `${percent * index}%`,
                  endPoint = `${percent * (index + 1)}%`,
                  pointValue = `${color} ${startPoint}, ${color} ${endPoint}`;
                (gradientValue = `${gradientValue} ${pointValue}`),
                  index !== colors.length - 1 &&
                    (gradientValue = `${gradientValue}, `);
              }),
              notValidColor === colors.length
                ? null
                : `linear-gradient(${gradientValue})`
            );
          }
          setPropertyValue(value) {
            const isImage = this.isImage(value),
              isUrl = this.isUrl(value),
              isGradient = this.isGradient(value),
              isValidColor = this.isColor(value),
              bgColorHex = this.dataset.sectionBackground,
              bgColorName = (0, color_1.hexToColorName)(bgColorHex);
            if (isUrl)
              this.element.removeAttribute("not-valid"),
                this.element.style.setProperty(
                  "--gsc-color-swatch-value",
                  `url(${value})`
                ),
                this.setSimilarlyBgColorStatus(!1);
            else if (isImage) this.setSimilarlyBgColorStatus(!1);
            else if (isGradient) {
              const gradientColors = value.split("/"),
                gradientValue = this.getGradientValue(gradientColors),
                isSimilarlyBgColor =
                  value.includes(bgColorHex) || value.includes(bgColorName);
              gradientValue &&
                (this.element.removeAttribute("not-valid"),
                this.element.style.setProperty(
                  "--gsc-color-swatch-value",
                  gradientValue
                )),
                this.setSimilarlyBgColorStatus(isSimilarlyBgColor);
            } else {
              const isSimilarlyBgColor =
                value === bgColorHex || value === bgColorName;
              isValidColor && this.element.removeAttribute("not-valid"),
                this.setSimilarlyBgColorStatus(isSimilarlyBgColor),
                this.element.style.setProperty(
                  "--gsc-color-swatch-value",
                  value
                );
            }
          }
          setSimilarlyBgColorStatus(isSimilarlyBgColor) {
            this.element.toggleAttribute(
              "section-background-color-equally",
              isSimilarlyBgColor
            );
          }
          isColor(color) {
            const style = new Option().style;
            return (style.color = color), style.color !== "";
          }
          isImage(value) {
            return value.includes(".png") || value.includes(".jp");
          }
          isUrl(value) {
            try {
              return new URL(value), !0;
            } catch {
              return !1;
            }
          }
          isGradient(value) {
            return value.includes("/");
          }
        }
        exports.ShapeSwatch = ShapeSwatch;
      },
      3533: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ShareWrapper = exports.ShareComponent = void 0);
        var share_component_1 = __webpack_require__2(5190);
        Object.defineProperty(exports, "ShareComponent", {
          enumerable: !0,
          get: function () {
            return share_component_1.ShareComponent;
          },
        });
        var share_wrapper_1 = __webpack_require__2(7116);
        Object.defineProperty(exports, "ShareWrapper", {
          enumerable: !0,
          get: function () {
            return share_wrapper_1.ShareWrapper;
          },
        });
      },
      5190: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ShareComponent = void 0);
        const base_component_1 = __webpack_require__2(3608);
        class ShareComponent extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "click", this.handleClick);
          }
          handleClick = (event) => {
            event.preventDefault(),
              navigator.share &&
                navigator.share({ text: this.dataset.valueToCopy });
          };
        }
        exports.ShareComponent = ShareComponent;
      },
      7116: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ShareWrapper = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          TEMPLATE_SELECTOR = "[data-share-custom-template]",
          DEFAULT_TEMPLATE_SELECTOR = "[data-share-system-default-template]";
        class ShareWrapper extends base_component_1.BaseComponent {
          mountComponent() {
            this.init();
          }
          init() {
            const customTemplate = (0, utils_1.$el)(TEMPLATE_SELECTOR, this),
              systemDefaultTemplate = (0, utils_1.$el)(
                DEFAULT_TEMPLATE_SELECTOR,
                this
              ),
              template = navigator.share
                ? systemDefaultTemplate
                : customTemplate;
            this.replaceChildren((0, dom_1.getTemplateContent)(template));
          }
        }
        exports.ShareWrapper = ShareWrapper;
      },
      6426: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SidebarButton = exports.SidebarComponent = void 0);
        var sidebar_1 = __webpack_require__2(4622);
        Object.defineProperty(exports, "SidebarComponent", {
          enumerable: !0,
          get: function () {
            return sidebar_1.SidebarComponent;
          },
        });
        var sidebar_button_1 = __webpack_require__2(9315);
        Object.defineProperty(exports, "SidebarButton", {
          enumerable: !0,
          get: function () {
            return sidebar_button_1.SidebarButton;
          },
        });
      },
      9315: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SidebarButton = void 0);
        const base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          utils_1 = __webpack_require__2(4083),
          BUTTON_SELECTOR = "[data-sidebar-button]";
        class SidebarButton extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "click", this.handleButtonClick),
              this.addListener(this, "keydown", this.handleKeyDown);
          }
          handleButtonClick = (event) => {
            event.target.closest("[href]") ||
              (event.preventDefault(), this.toggle(event));
          };
          handleKeyDown = (event) => {
            (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.toggle(event));
          };
          toggle(event) {
            const button = (0, utils_1.$el)(BUTTON_SELECTOR, this),
              sidebar = (0, utils_1.$el)(`#${button.dataset.sidebarId}`);
            sidebar?.toggle(event),
              button?.classList.toggle("is-opened", sidebar?.isOpen);
          }
        }
        exports.SidebarButton = SidebarButton;
      },
      4622: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SidebarComponent = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          key_1 = __webpack_require__2(9650),
          dom_1 = __webpack_require__2(3889),
          check_media_1 = __webpack_require__2(5580),
          BODY_ELEMENT_SELECTOR = "body-element";
        class SidebarComponent extends base_component_1.BaseComponent {
          template;
          element;
          touchStartX;
          touchStartY;
          touchEndX;
          touchEndY;
          isOpen;
          constructor() {
            super(),
              this.hasAttribute("is-open-on-init")
                ? (this.element = (0, utils_1.$el)("[data-sidebar-body]", this))
                : (this.element = (0, dom_1.getTemplateFirstChild)(
                    (0, utils_1.$el)(
                      `[data-sidebar-template="${this.id}"]`,
                      this
                    )
                  )),
              (this.isOpen = this.classList.contains("is-opened"));
          }
          mountComponent() {
            super.mountComponent(),
              this.isEditor &&
                (this.isSection || this.hide(!0),
                this.editor.on("SECTION_SELECT", this.handleSectionSelect),
                this.editor.on("SECTION_DESELECT", this.handleSectionDeselect));
          }
          handleSidebarFocusout = (event) => {
            const bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR),
              focusTarget = event.relatedTarget,
              isLastOpenedWindow = bodyElement.isLastOpenedWindow(this.id);
            if (
              (!focusTarget || !this.contains(focusTarget)) &&
              isLastOpenedWindow &&
              bodyElement.isUsingKeyboard
            ) {
              const { firstTarget } = (0, utils_1.getTargets)(this.element);
              firstTarget.focus();
            }
          };
          handleSectionSelect = ({ detail: { sectionId } }) => {
            this.isSection &&
              this.dataset.sectionId === sectionId &&
              this.open();
          };
          handleSectionDeselect = ({ detail: { sectionId } }) => {
            this.isSection &&
              this.dataset.sectionId === sectionId &&
              this.hide();
          };
          handleOutsideClick = (event) => {
            (0, utils_1.$elParent)(BODY_ELEMENT_SELECTOR, event.target) &&
              this.isOpen &&
              this.hide();
          };
          handleTouchStart = (event) => {
            (this.touchStartX = event.targetTouches[0].clientX),
              (this.touchStartY = event.targetTouches[0].clientY);
          };
          handleTouchMove = (event) => {
            (this.touchEndX = event.targetTouches[0].clientX),
              (this.touchEndY = event.targetTouches[0].clientY);
          };
          handleTouchEnd = (event) => {
            const X_DIRECTION_THRESHOLD = this.offsetWidth / 2,
              Y_DIRECTION_THRESHOLD = 48,
              distanceX = Math.abs(this.touchStartX - this.touchEndX),
              distanceY = Math.abs(this.touchStartY - this.touchEndY),
              isCarousel = (0, utils_1.$elParent)(
                "[data-carousel-viewport]",
                event.target
              ),
              isPriceRange = (0, utils_1.$elParent)(
                "price-range",
                event.target
              );
            if (isCarousel || isPriceRange) {
              this.cleanTouchPoints();
              return;
            }
            if (this.touchEndX === 0) {
              this.cleanTouchPoints();
              return;
            }
            if (distanceY > Y_DIRECTION_THRESHOLD) {
              this.cleanTouchPoints();
              return;
            }
            const isTrigger =
              this.dataset.openDirection === "right"
                ? this.touchStartX < this.touchEndX
                : this.touchStartX > this.touchEndX;
            this.isOpen &&
              distanceX > X_DIRECTION_THRESHOLD &&
              isTrigger &&
              this.hide(),
              this.cleanTouchPoints();
          };
          handleKeydown = (event) => {
            this.hasAttribute("data-with-close-on-escape") &&
              (0, key_1.isEscKey)(event) &&
              (event.preventDefault(), this.hide());
          };
          cleanTouchPoints() {
            (this.touchStartX = 0),
              (this.touchEndX = 0),
              (this.touchStartY = 0),
              (this.touchEndY = 0);
          }
          async open(event) {
            const bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR);
            (0, utils_1.whenDefined)("body-element").then(() => {
              bodyElement.addDialogWindow(this.id);
            }),
              this.mount(),
              this.setOpenState(!0),
              await (0, utils_1.transitionToPromise)(this),
              (0, utils_1.$list)("lazy-video, video", this).forEach((video) => {
                video.play ? video.play() : video.initVideo();
              }),
              this.toggleListeners(!0),
              (0, check_media_1.isMobile)() ||
                (this.initFocus(), this.toggleCloseCursor(event));
          }
          async hide(isInstant) {
            const bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR);
            (0, utils_1.whenDefined)("body-element").then(() => {
              bodyElement.removeDialogWindow(this.id);
            }),
              this.toggleListeners(!1),
              this.toggleCloseCursor(),
              this.setOpenState(!1),
              isInstant
                ? this.unmount()
                : (await (0, utils_1.transitionToPromise)(this),
                  this.unmount()),
              this.removeAttribute("header-shadow-visible");
          }
          initFocus() {
            if ((0, utils_1.isNotIframe)()) {
              const { firstTarget } = (0, utils_1.getTargets)(this);
              firstTarget?.focus();
            }
          }
          async toggle(event) {
            this.isOpen ? this.hide() : this.open(event);
          }
          mount() {
            this.replaceChildren(this.element);
          }
          unmount() {
            this.replaceChildren();
          }
          updateTemplate(template) {
            (this.element = (0, dom_1.getTemplateFirstChild)(template)),
              this.replaceChildren(this.element);
          }
          setOpenState(isOpen) {
            (this.isOpen = isOpen),
              this.setVisible(isOpen),
              this.toggleOverlay(isOpen),
              (0, utils_1.$list)(
                `[data-sidebar-button][data-sidebar-id="${this.id}"]`
              ).forEach((button) => {
                button.classList.toggle("is-opened", isOpen);
              });
          }
          toggleOverlay = (isOpen) => {
            const overlayType = this.getAttribute("data-with-overlay"),
              bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR);
            if (
              (0, check_media_1.isMobile)() &&
              overlayType === "only-desktop"
            ) {
              isOpen
                ? bodyElement.setScrollLock()
                : bodyElement.unsetScrollLock();
              return;
            }
            if (overlayType !== null) {
              const isImportant = this.hasAttribute("data-overlay-important"),
                hasCustomOpacity = this.hasAttribute("data-overlay-opacity"),
                computedStyles = getComputedStyle(this);
              let styles = {};
              isImportant &&
                (styles = {
                  ...styles,
                  zIndex: parseFloat(computedStyles.zIndex) - 1,
                }),
                hasCustomOpacity &&
                  (styles = {
                    ...styles,
                    "--gsc-overlay-opacity": +this.getAttribute(
                      "data-overlay-opacity"
                    ),
                  }),
                (0, utils_1.whenDefined)("body-element").then(() => {
                  isOpen
                    ? bodyElement.showOverlay(this.id, styles)
                    : bodyElement.hideOverlay(this.id);
                });
            }
          };
          setVisible(isVisible) {
            this.classList.toggle("is-opened", isVisible);
          }
          toggleCloseCursor = (event) => {
            const closeCursor = (0, utils_1.$el)("close-cursor");
            (0, utils_1.whenDefined)("close-cursor").then(() => {
              closeCursor?.toggle(event);
            });
          };
          toggleListeners = (boolean) => {
            const withOutsideClick = this.hasAttribute(
              "data-with-close-on-outside"
            );
            boolean
              ? (this.addListener(window, "keydown", this.handleKeydown),
                this.addListener(this, "focusout", this.handleSidebarFocusout),
                this.addListener(this, "touchstart", this.handleTouchStart),
                this.addListener(this, "touchmove", this.handleTouchMove),
                this.addListener(this, "touchend", this.handleTouchEnd),
                withOutsideClick &&
                  this.addListener(window, "click", this.handleOutsideClick))
              : (this.removeListener(window, "keydown", this.handleKeydown),
                this.removeListener(
                  this,
                  "focusout",
                  this.handleSidebarFocusout
                ),
                this.removeListener(this, "touchstart", this.handleTouchStart),
                this.removeListener(this, "touchmove", this.handleTouchMove),
                this.removeListener(this, "touchend", this.handleTouchEnd),
                withOutsideClick &&
                  this.removeListener(
                    window,
                    "click",
                    this.handleOutsideClick
                  ));
          };
          get isSection() {
            return this.hasAttribute("data-sidebar-section");
          }
        }
        exports.SidebarComponent = SidebarComponent;
      },
      5285: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.StickyCartButton = void 0);
        var sticky_cart_button_1 = __webpack_require__2(7767);
        Object.defineProperty(exports, "StickyCartButton", {
          enumerable: !0,
          get: function () {
            return sticky_cart_button_1.StickyCartButton;
          },
        });
      },
      7767: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.StickyCartButton = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          BUTTON_SELECTOR = "[data-cart-sticky-button]",
          HEADER_SELECTOR = ".shopify-section.shopify-section-header";
        class StickyCartButton extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(window, "scroll", this.handleWindowScroll);
          }
          handleWindowScroll = () => {
            const header = (0, utils_1.$el)(HEADER_SELECTOR),
              button = (0, utils_1.$el)(BUTTON_SELECTOR, this);
            if (header && button) {
              const rect = header.getBoundingClientRect();
              button.classList.toggle(
                "is-visible",
                rect.bottom + button.offsetHeight < 0
              );
            }
          };
        }
        exports.StickyCartButton = StickyCartButton;
      },
      1167: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TabsComponent =
            exports.TabWithDynamicHeight =
            exports.TabComponent =
              void 0);
        var tab_1 = __webpack_require__2(3722);
        Object.defineProperty(exports, "TabComponent", {
          enumerable: !0,
          get: function () {
            return tab_1.TabComponent;
          },
        });
        var tab_with_dynamic_height_1 = __webpack_require__2(8042);
        Object.defineProperty(exports, "TabWithDynamicHeight", {
          enumerable: !0,
          get: function () {
            return tab_with_dynamic_height_1.TabWithDynamicHeight;
          },
        });
        var tabs_1 = __webpack_require__2(7812);
        Object.defineProperty(exports, "TabsComponent", {
          enumerable: !0,
          get: function () {
            return tabs_1.TabsComponent;
          },
        });
      },
      8042: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TabWithDynamicHeight = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          CONTENT_SELECTOR = "[data-tabs-element-content]";
        class TabWithDynamicHeight extends base_component_1.BaseComponent {
          resizeObserver;
          mountComponent() {
            const content = (0, utils_1.$el)(CONTENT_SELECTOR, this);
            (this.resizeObserver = new ResizeObserver(this.handleResize)),
              this.resizeObserver.observe(content),
              this.updateHeight();
          }
          unmountComponent() {
            this.resizeObserver.disconnect();
          }
          handleResize = () => {
            this.updateHeight();
          };
          attributeChangedCallback(name, oldValue, newValue) {
            this.updateHeight();
          }
          async show() {
            this.setVisible(!0);
          }
          async hide() {
            this.setVisible(!1);
          }
          setVisible(isVisible) {
            this.setAttribute("aria-hidden", isVisible ? "false" : "true");
          }
          updateHeight() {
            const content = (0, utils_1.$el)(CONTENT_SELECTOR, this);
            content &&
              (this.style.maxHeight = `${Math.ceil(
                this.isVisible ? content.offsetHeight : 0
              )}px`);
          }
          get isVisible() {
            return this.getAttribute("aria-hidden") === "false";
          }
          static get observedAttributes() {
            return ["aria-hidden"];
          }
        }
        exports.TabWithDynamicHeight = TabWithDynamicHeight;
      },
      3722: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TabComponent = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608);
        class TabComponent extends base_component_1.BaseComponent {
          async show() {
            await this.setVisible(!0);
          }
          async hide() {
            await this.setVisible(!1);
          }
          async setVisible(isVisible) {
            this.setAttribute("aria-hidden", isVisible ? "false" : "true"),
              await (0, utils_1.transitionToPromise)(this);
          }
          get isVisible() {
            return this.getAttribute("aria-hidden") === "false";
          }
        }
        exports.TabComponent = TabComponent;
      },
      7812: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TabsComponent = void 0);
        const base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          CONTAINER_SELECTOR = "[data-tabs-container]",
          TEMPLATE_SELECTOR = "[data-tabs-elements-template]",
          TAB_SELECTOR = "tab-component, tab-with-dynamic-height",
          TAB_NAME_SELECTOR = "[data-tabs-name]";
        class TabsComponent extends base_component_1.BaseComponent {
          template;
          templateContent;
          tabs;
          constructor() {
            super(),
              (this.template = (0, utils_1.$el)(TEMPLATE_SELECTOR, this)),
              (this.templateContent = (0, dom_1.getTemplateContent)(
                this.template
              )),
              (this.tabs = [
                (0, utils_1.$el)(TAB_SELECTOR, this),
                ...(0, utils_1.$list)(TAB_SELECTOR, this.templateContent),
              ]);
          }
          mountComponent() {
            (0, utils_1.$list)(TAB_NAME_SELECTOR, this).forEach((name) => {
              this.addListener(name, "keydown", this.handleKeyDown),
                this.addListener(name, "click", this.handleNameClick);
            });
          }
          handleNameClick = (event) => {
            event.preventDefault();
            const target = event.target.closest("[data-id]");
            target.dataset.id && this.selectTab(target.dataset.id);
          };
          handleKeyDown = (event) => {
            const target = event.target;
            target.dataset.id &&
              (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.selectTab(target.dataset.id));
          };
          generateTabMap() {
            return this.tabs.reduce((map, tab) => {
              const tabId = tab.dataset.id;
              return tabId ? { ...map, [tabId]: tab } : map;
            }, {});
          }
          async selectTab(tabId) {
            this.updateNameById(tabId), await this.showNextTab(tabId);
          }
          updateNameById(tabId) {
            (0, utils_1.$list)(TAB_NAME_SELECTOR, this).forEach((name) => {
              name.classList.toggle(
                "selected",
                tabId === name.getAttribute("data-id")
              );
            });
          }
          async showNextTab(tabId) {
            const tab = this.generateTabMap()[tabId],
              id = tab.getAttribute("data-id"),
              container = (0, utils_1.$el)(CONTAINER_SELECTOR, this);
            if (!id || !container) return;
            (this.dataset.selectedTabId = id),
              container.replaceChildren(tab),
              await tab.show(),
              (0, utils_1.$el)("video[autoplay]", tab)?.play(),
              this.emit("selectTab", { tabId, tab });
          }
          getNames() {
            return (0, utils_1.$list)(TAB_NAME_SELECTOR, this);
          }
        }
        exports.TabsComponent = TabsComponent;
      },
      4736: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TestimonialsComponent = void 0);
        var testimonials_1 = __webpack_require__2(9615);
        Object.defineProperty(exports, "TestimonialsComponent", {
          enumerable: !0,
          get: function () {
            return testimonials_1.TestimonialsComponent;
          },
        });
      },
      9615: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.TestimonialsComponent = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          check_media_1 = __webpack_require__2(5580),
          debounce_1 = __webpack_require__2(2731);
        class TestimonialsComponent extends base_component_1.BaseComponent {
          resizeObserver;
          blockId;
          gridElements;
          carousels;
          mountComponent() {
            this.isEditor &&
              ((this.gridElements = (0, utils_1.$list)(
                "quote-component",
                this
              )),
              (this.carousels = (0, utils_1.$list)("carousel-component", this)),
              this.carousels.forEach((carousel) => {
                carousel.editor.destroy(),
                  (carousel.handleBlockSelect = this.handleBlockSelect);
              }),
              this.editor.on("BLOCK_SELECT", this.handleBlockSelect),
              this.editor.on("SECTION_LOAD", this.handleSectionLoad),
              (this.resizeObserver = new ResizeObserver(this.handleResize)),
              this.resizeObserver.observe(this),
              this.blockId && this.scrollToSelectedBlock());
          }
          handleSectionLoad = () => {
            this.blockId && this.scrollToSelectedBlock();
          };
          handleBlockSelect = ({ detail: { sectionId, blockId, load } }) => {
            this.dataset.sectionId === sectionId &&
              ((this.blockId = blockId), this.scrollToSelectedBlock());
          };
          handleResize = (0, debounce_1.debounce)(() => {
            this.blockId && this.scrollToSelectedBlock();
          }, 100);
          scrollToSelectedBlock = () => {
            (!(0, check_media_1.isMobile)() &&
              this.dataset.desktopLayout.includes("grid")) ||
            ((0, check_media_1.isMobile)() &&
              this.dataset.mobileLayout.includes("column"))
              ? this.scrollGrid()
              : this.scrollCarousel();
          };
          scrollCarousel = () => {
            const carousel = (0, utils_1.$list)(
                "carousel-component",
                this
              ).filter((carousel2) => carousel2.offsetWidth > 0)[0],
              dots = (0, utils_1.$el)("carousel-dots", carousel),
              slideIndex = carousel.embla
                .slideNodes()
                .findIndex(
                  ({ attributes }) =>
                    attributes["block-id"]?.value === this.blockId
                ),
              scrollToIndex =
                slideIndex % +this.dataset.desktopColumns === 0
                  ? Math.floor(slideIndex / +this.dataset.desktopColumns)
                  : Math.floor((slideIndex - 1) / +this.dataset.desktopColumns);
            scrollToIndex !== -1 &&
              (carousel.embla.scrollTo(
                (0, check_media_1.isMobile)() ? slideIndex : scrollToIndex,
                !1
              ),
              carousel.stop(),
              dots?.handleCarouselSelect());
          };
          scrollGrid = () => {
            const block = this.gridElements
              .filter((el) => el.offsetWidth > 0)
              .find(
                ({ attributes }) =>
                  attributes["block-id"]?.value === this.blockId
              );
            (0, utils_1.isNotThemeStore)() &&
              block?.scrollIntoView({ block: "center", behavior: "smooth" });
          };
        }
        exports.TestimonialsComponent = TestimonialsComponent;
      },
      4830: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.BeforeAfterImages = void 0);
        const base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          utils_1 = __webpack_require__2(4083),
          BUTTON_SELECTOR = "[data-before-after-images-button]",
          STEP = 20,
          WITH_TRANSITION_CLASS = "before-after--with-transition",
          SEPARATOR_SELECTOR = "[data-before-after-images-separator]";
        class BeforeAfterImages extends base_component_1.BaseComponent {
          isMoving = !1;
          intersectionObserver;
          mountComponent() {
            const button = (0, utils_1.$el)(BUTTON_SELECTOR, this);
            this.addListener(button, "keyup", this.handleButtonKeyUp),
              this.addListener(button, "mousedown", this.handleButtonMouseDown),
              this.addListener(document, "mouseup", this.handleButtonMouseUp),
              this.addListener(document, "mousemove", this.handleMouseMove),
              this.addListener(button, "touchstart", this.handleTouchStart),
              this.addListener(this, "touchmove", this.handleTouchMove),
              this.addListener(document, "touchend", this.handleTouchEnd),
              (this.intersectionObserver = new IntersectionObserver(
                this.handleInViewport,
                { rootMargin: "0px" }
              )),
              this.intersectionObserver.observe(this);
          }
          unmountComponent() {
            this.intersectionObserver?.disconnect();
          }
          setInitialPosition = async () => {
            const separator = (0, utils_1.$el)(SEPARATOR_SELECTOR, this);
            this.setPosition(Number(this.dataset.initialDragPosition)),
              await (0, utils_1.transitionToPromise)(separator),
              this.classList.remove(WITH_TRANSITION_CLASS);
          };
          handleInViewport = (entries) => {
            entries.some((entry) => entry.isIntersecting) &&
              (this.intersectionObserver.disconnect(),
              this.setInitialPosition());
          };
          handleButtonMouseDown = (event) => {
            event.preventDefault(), this.startMove();
          };
          handleButtonMouseUp = () => {
            this.endMove();
          };
          handleMouseMove = (event) => {
            this.isMoving && this.move(event.pageX);
          };
          handleButtonKeyUp = (event) => {
            const button = (0, utils_1.$el)(BUTTON_SELECTOR, this);
            if (
              !button ||
              (!(0, key_1.isLeftKey)(event) && !(0, key_1.isRightKey)(event))
            )
              return;
            const rect = button.getBoundingClientRect(),
              point = rect.right - rect.width / 2,
              position = (0, key_1.isLeftKey)(event)
                ? point - STEP
                : point + STEP;
            this.move(position);
          };
          handleTouchStart = () => {
            this.startMove();
          };
          handleTouchEnd = () => {
            this.endMove();
          };
          handleTouchMove = (event) => {
            this.isMoving &&
              (event.preventDefault(),
              this.move(event.targetTouches[0].clientX));
          };
          startMove() {
            this.isMoving = !0;
          }
          endMove() {
            this.isMoving = !1;
          }
          setPosition(position) {
            this.style.setProperty("--gsc-drag-position", `${position}%`);
          }
          move(newPosition) {
            const rect = this.getBoundingClientRect();
            if (newPosition <= rect.left) this.setPosition(0);
            else if (newPosition >= rect.right) this.setPosition(100);
            else {
              const position =
                Math.floor(
                  ((newPosition - rect.left) / this.offsetWidth) * 1e3
                ) / 10;
              this.setPosition(position);
            }
          }
        }
        exports.BeforeAfterImages = BeforeAfterImages;
      },
      7126: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.BeforeAfterImages = void 0);
        var before_after_images_1 = __webpack_require__2(4830);
        Object.defineProperty(exports, "BeforeAfterImages", {
          enumerable: !0,
          get: function () {
            return before_after_images_1.BeforeAfterImages;
          },
        });
      },
      8733: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartDrawerButtonsBlock = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          CART_DRAWER_SELECTOR = "cart-drawer",
          CHECKOUT_BUTTON_SELECTOR = "[data-cart-checkout-button]";
        class CartDrawerButtonsBlock extends base_component_1.BaseComponent {
          mountComponent() {
            const cartDrawer = (0, utils_1.$elParent)(
              CART_DRAWER_SELECTOR,
              this
            );
            cartDrawer?.on("start-update", this.handleStartCartUpdate),
              cartDrawer?.on("stop-update", this.handleCartUpdate),
              cartDrawer?.on("update-nodes", this.handleCartUpdate);
          }
          unmountComponent() {
            const cartDrawer = (0, utils_1.$elParent)(
              CART_DRAWER_SELECTOR,
              this
            );
            cartDrawer?.off("start-update", this.handleStartCartUpdate),
              cartDrawer?.off("update-nodes", this.handleCartUpdate);
          }
          handleStartCartUpdate = () => {
            this.setLoading(!0);
          };
          handleCartUpdate = () => {
            this.setLoading(!1);
          };
          setLoading(isLoading) {
            const button = (0, utils_1.$el)(CHECKOUT_BUTTON_SELECTOR, this);
            button?.toggleAttribute("disabled", isLoading),
              button?.classList.toggle("loading", isLoading);
          }
        }
        exports.CartDrawerButtonsBlock = CartDrawerButtonsBlock;
      },
      8640: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartDrawerFooter = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          CART_DRAWER_SELECTOR = "cart-drawer",
          CART_DRAWER_FOOTER_SELECTOR = "cart-drawer-footer";
        class CartDrawerFooter extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$elParent)(CART_DRAWER_SELECTOR, this)?.on(
              "update-nodes",
              this.handleCartDrawerUpdate
            );
          }
          unmountComponent() {
            (0, utils_1.$elParent)(CART_DRAWER_SELECTOR, this)?.off(
              "update-nodes",
              this.handleCartDrawerUpdate
            );
          }
          handleCartDrawerUpdate = ({ node }) => {
            (0, dom_1.replaceNodeChildren)(
              this,
              (0, utils_1.$el)(CART_DRAWER_FOOTER_SELECTOR, node)
            );
          };
        }
        exports.CartDrawerFooter = CartDrawerFooter;
      },
      2715: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartDrawerFreeShippingBarBlock = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          CART_DRAWER_SELECTOR = "cart-drawer",
          FREE_SHIPPING_BAR_SELECTOR = "free-shipping-bar";
        class CartDrawerFreeShippingBarBlock extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$elParent)(CART_DRAWER_SELECTOR, this)?.on(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          unmountComponent() {
            (0, utils_1.$elParent)(CART_DRAWER_SELECTOR, this)?.off(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          handleCartUpdate = (data) => {
            const bar = (0, utils_1.$el)(FREE_SHIPPING_BAR_SELECTOR, this),
              newBar = (0, utils_1.$el)(FREE_SHIPPING_BAR_SELECTOR, data.node);
            if (!bar || !newBar) return;
            const difference =
                newBar.getAttribute("data-free-shipping-difference") || "",
              differencePercent = +(
                newBar.getAttribute("data-free-shipping-difference-percent") ||
                0
              );
            bar.updateProgressByDifference(difference, differencePercent);
          };
        }
        exports.CartDrawerFreeShippingBarBlock = CartDrawerFreeShippingBarBlock;
      },
      4029: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartDrawerHeader = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          CART_DRAWER_SELECTOR = "cart-drawer",
          CART_DRAWER_HEADER_SELECTOR = "cart-drawer-header";
        class CartDrawerHeader extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$elParent)(CART_DRAWER_SELECTOR, this)?.on(
              "update-nodes",
              this.handleCartDrawerUpdate
            );
          }
          unmountComponent() {
            (0, utils_1.$elParent)(CART_DRAWER_SELECTOR, this)?.off(
              "update-nodes",
              this.handleCartDrawerUpdate
            );
          }
          handleCartDrawerUpdate = ({ node }) => {
            (0, dom_1.replaceNodeChildren)(
              this,
              (0, utils_1.$el)(CART_DRAWER_HEADER_SELECTOR, node)
            );
          };
        }
        exports.CartDrawerHeader = CartDrawerHeader;
      },
      358: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartDrawerInCartBannerBlock = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          CART_DRAWER_SELECTOR = "cart-drawer",
          CART_DRAWER_IN_CART_BANNER_SELECTOR =
            "cart-drawer-in-cart-banner-block";
        class CartDrawerInCartBannerBlock extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$elParent)(CART_DRAWER_SELECTOR, this)?.on(
              "update-nodes",
              this.handleCartDrawerUpdate
            );
          }
          unmountComponent() {
            (0, utils_1.$elParent)(CART_DRAWER_SELECTOR, this)?.off(
              "update-nodes",
              this.handleCartDrawerUpdate
            );
          }
          handleCartDrawerUpdate = ({ node }) => {
            (0, dom_1.replaceNodeChildren)(
              this,
              (0, utils_1.$el)(
                `${CART_DRAWER_IN_CART_BANNER_SELECTOR}[block-id="${this.getAttribute(
                  "block-id"
                )}"]`,
                node
              )
            );
          };
        }
        exports.CartDrawerInCartBannerBlock = CartDrawerInCartBannerBlock;
      },
      2411: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartDrawerItemsBlock = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          CART_DRAWER_SELECTOR = "cart-drawer",
          CART_DRAWER_ITEM_SELECTOR = "cart-drawer-items-block";
        class CartDrawerItemsBlock extends base_component_1.BaseComponent {
          mountComponent() {
            const cartDrawer = (0, utils_1.$elParent)(
              CART_DRAWER_SELECTOR,
              this
            );
            cartDrawer?.on("update-nodes", this.handleCartDrawerUpdate),
              cartDrawer?.on("purchase", this.handleCartDrawerPurschase);
          }
          unmountComponent() {
            const cartDrawer = (0, utils_1.$elParent)(
              CART_DRAWER_SELECTOR,
              this
            );
            cartDrawer?.off("update-nodes", this.handleCartDrawerUpdate),
              cartDrawer?.off("purchase", this.handleCartDrawerPurschase);
          }
          handleCartDrawerUpdate = ({ node, parsedState }) => {
            const newCartItems = (0, utils_1.$el)(
              `${CART_DRAWER_ITEM_SELECTOR}[block-id="${this.getAttribute(
                "block-id"
              )}"]`,
              node
            );
            parsedState &&
              parsedState.quantity === 1 &&
              (0, utils_1.$el)(
                `cart-item[data-variant-id="${parsedState.id}"]`,
                newCartItems
              ).setAttribute("is-new", ""),
              (0, dom_1.replaceNodeChildren)(this, newCartItems);
          };
          handleCartDrawerPurschase = async ({ parsedState }) => {
            const item = (0, utils_1.$el)(
              `cart-item[data-variant-id="${parsedState.id}"]`,
              this
            );
            item && parsedState.quantity === 1 && (await item?.showAsNew()),
              item?.showCheckmark();
          };
        }
        exports.CartDrawerItemsBlock = CartDrawerItemsBlock;
      },
      8476: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartDrawerRelatedProductsBlock = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          RELATED_PRODUCTS_SELECTOR = "[data-cart-drawer-related-products]",
          CART_DRAWER_SELECTOR = "cart-drawer",
          CART_DRAWER_RELATED_PRODUCTS_SELECTOR =
            "cart-drawer-related-products-block",
          CAROUSEL_SELECTOR = "carousel-component";
        class CartDrawerRelatedProductsBlock extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$elParent)(CART_DRAWER_SELECTOR, this)?.on(
              "update-nodes",
              this.handleCartDrawerUpdate
            );
          }
          unmountComponent() {
            (0, utils_1.$elParent)(CART_DRAWER_SELECTOR, this)?.off(
              "update-nodes",
              this.handleCartDrawerUpdate
            );
          }
          handleCartDrawerUpdate = ({ node }) => {
            const relatedProducts = (0, utils_1.$el)(
              RELATED_PRODUCTS_SELECTOR,
              this
            );
            if (!relatedProducts) return;
            const newRelatedProducts = (0, utils_1.$el)(
              `${CART_DRAWER_RELATED_PRODUCTS_SELECTOR}[block-id="${this.getAttribute(
                "block-id"
              )}"] [data-cart-drawer-related-products]`,
              node
            );
            if (!newRelatedProducts) return;
            if (this.hasAttribute("is-auto-recommendations")) {
              const newUrl = newRelatedProducts.getAttribute("data-url");
              relatedProducts.setAttribute("data-url", newUrl),
                newUrl
                  ? relatedProducts.loadProducts()
                  : (relatedProducts.erase(),
                    this.checkHasAsideProducts(),
                    this.updateVisibility());
            } else
              (0, dom_1.replaceNodeChildren)(
                relatedProducts,
                newRelatedProducts
              ),
                this.checkHasAsideProducts(),
                this.updateVisibility();
            this.reInitCarousel();
          };
          checkHasAsideProducts() {
            if (this.hasAttribute("is-aside-related-products")) {
              const products = (0, utils_1.$list)(
                  "[is-aside-related-products] vertical-product-card, [is-aside-related-products] horizontal-product-card"
                ),
                cartDrawer = (0, utils_1.$el)("cart-drawer"),
                hasAsideProducts = products?.length > 0;
              cartDrawer &&
                cartDrawer.toggleAttribute(
                  "has-aside-products",
                  hasAsideProducts
                );
            }
          }
          updateVisibility = () => {
            if (!this.hasAttribute("is-aside-related-products")) {
              const cartDrawer = (0, utils_1.$el)("cart-drawer"),
                cartDrawerItems = !!(0, utils_1.$el)("cart-item", cartDrawer);
              cartDrawer.toggleAttribute("empty-cart", !cartDrawerItems);
            }
          };
          reInitCarousel = () => {
            const carousel = (0, utils_1.$el)(CAROUSEL_SELECTOR, this);
            carousel &&
              carousel.withAutoplay &&
              (carousel.setCarousel(), carousel.setAutoplay());
          };
        }
        exports.CartDrawerRelatedProductsBlock = CartDrawerRelatedProductsBlock;
      },
      3255: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartDrawerRelatedProducts = void 0);
        const dom_1 = __webpack_require__2(3889),
          base_component_1 = __webpack_require__2(3608),
          dom_2 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          LOADING_OVERLAY_SELECTOR = ".loading-overlay",
          IN_CART_RELATED_PRODUCTS_SELECTOR = "[in-cart-related-product]",
          CART_DRAWER_TEMPLATE_SELECTOR =
            '[data-sidebar-template="CartDrawer"]',
          BODY_ELEMENT_SELECTOR = "body-element";
        class CartDrawerRelatedProducts extends base_component_1.BaseComponent {
          prevUrl;
          mountComponent() {
            this.loadProducts();
          }
          erase() {
            this.replaceChildren(), this.setReady(!1);
          }
          loadProducts() {
            if (
              this.prevUrl !== this.dataset.url &&
              ((this.prevUrl = this.dataset.url), !!this.dataset.url)
            )
              return (
                this.showPreloader(),
                fetch(this.dataset.url)
                  .then((response) => response.text())
                  .then((text) => {
                    this.hidePreloader();
                    const template = (0, utils_1.$el)(
                        CART_DRAWER_TEMPLATE_SELECTOR,
                        (0, dom_1.parseHTML)(text)
                      ),
                      node = (0, dom_1.getTemplateFirstChild)(template);
                    this.updateByHTML(node);
                  })
                  .catch(() => {
                    (0, utils_1.$el)(BODY_ELEMENT_SELECTOR).showNotification(
                      "Error in cart drawer related products",
                      "warning"
                    );
                  })
              );
          }
          updateByHTML = (node) => {
            const recommendations = (0, utils_1.$el)(`#${this.id}`, node);
            (0, dom_1.replaceNodeChildren)(this, recommendations);
            const products = (0, utils_1.$list)(
              IN_CART_RELATED_PRODUCTS_SELECTOR,
              this
            );
            this.setReady(products.length > 0);
          };
          setReady(isReady) {
            this.toggleAttribute("is-ready", isReady);
          }
          showPreloader() {
            const preloader = (0, utils_1.$el)(LOADING_OVERLAY_SELECTOR, this);
            (0, dom_2.showElement)(preloader);
          }
          hidePreloader() {
            const preloader = (0, utils_1.$el)(LOADING_OVERLAY_SELECTOR, this);
            (0, dom_2.hideElement)(preloader);
          }
        }
        exports.CartDrawerRelatedProducts = CartDrawerRelatedProducts;
      },
      5198: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartDrawerTimerBlock = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          CART_DRAWER_SELECTOR = "cart-drawer",
          CART_DRAWER_TIMER_BLOCK_SELECTOR = "cart-drawer-timer-block";
        class CartDrawerTimerBlock extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$elParent)(CART_DRAWER_SELECTOR, this)?.on(
              "update-nodes",
              this.handleCartDrawerUpdate
            );
          }
          unmountComponent() {
            (0, utils_1.$elParent)(CART_DRAWER_SELECTOR, this)?.off(
              "update-nodes",
              this.handleCartDrawerUpdate
            );
          }
          handleCartDrawerUpdate = ({ node }) => {
            (0, dom_1.replaceNodeChildren)(
              this,
              (0, utils_1.$el)(
                `${CART_DRAWER_TIMER_BLOCK_SELECTOR}[block-id="${this.getAttribute(
                  "block-id"
                )}"]`,
                node
              )
            );
          };
        }
        exports.CartDrawerTimerBlock = CartDrawerTimerBlock;
      },
      4626: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartDrawer = void 0);
        const cart_api_1 = __webpack_require__2(735),
          fetch_config_1 = __webpack_require__2(8548),
          sidebar_1 = __webpack_require__2(4622),
          dom_1 = __webpack_require__2(3889),
          debounce_1 = __webpack_require__2(2731),
          utils_1 = __webpack_require__2(4083),
          transition_util_1 = __webpack_require__2(7322),
          VIEWPORT_SELECTOR = "[data-cart-drawer-viewport]",
          RESULTS_SELECTOR = "[data-cart-drawer-results]",
          NOTIFICATION_SELECTOR = "#CartDrawerNotification",
          CART_ITEM_SELECTOR = "cart-item";
        class CartDrawer extends sidebar_1.SidebarComponent {
          cartAPI = new cart_api_1.CartAPI();
          resizeObserver;
          lastDrawerBody;
          error;
          mountComponent() {
            super.mountComponent();
            const viewport = (0, utils_1.$el)(VIEWPORT_SELECTOR, this.element),
              results = (0, utils_1.$el)(RESULTS_SELECTOR, this.element);
            results &&
              ((this.resizeObserver = new ResizeObserver(
                this.handleResultsResize
              )),
              this.resizeObserver.observe(results)),
              this.addListener(this, "change", this.handleCartChange),
              this.addListener(this, "change", this.handleItemChange),
              this.addListener(viewport, "scroll", this.handleViewportScroll);
          }
          unmountComponent() {
            super.unmountComponent(), this.resizeObserver.disconnect();
          }
          handleItemChange = ({ target }) => {
            const item = (0, utils_1.$el)(
              `#CartItem-${+target.dataset.index}`,
              this
            );
            item && (item.setLoading(!0), this.setLoadingStatus(!0));
          };
          handleCartChange = (0, debounce_1.debounce)(({ target }) => {
            this.updateItem(+target.dataset.index, +target.value);
          }, 500);
          handleViewportScroll = (0, debounce_1.debounce)(() => {
            this.updateViewport();
          }, 25);
          handleResultsResize = (0, debounce_1.debounce)(() => {
            this.updateViewport();
          }, 25);
          updateViewport() {
            const results = (0, utils_1.$el)(RESULTS_SELECTOR, this.element),
              viewport = (0, utils_1.$el)(VIEWPORT_SELECTOR, this.element);
            if (!results || !viewport) return;
            const isOverflow = results.offsetHeight > viewport.offsetHeight,
              isScrolled = viewport.scrollTop > 0,
              isBottom =
                results.offsetHeight - viewport.scrollTop ===
                viewport.offsetHeight;
            this.classList.toggle(
              "header-shadow-visible",
              isOverflow && isScrolled
            ),
              this.classList.toggle(
                "footer-shadow-visible",
                isOverflow && !isBottom
              );
          }
          update() {
            this.cartAPI
              .getDrawer()
              .then((responseText) => {
                this.lastDrawerBody = this.getTemplateContent(
                  (0, dom_1.parseHTML)(responseText)
                );
              })
              .catch(() => {
                this.showError("");
              })
              .finally(() => {
                this.mount(),
                  this.emit("update-nodes", { node: this.lastDrawerBody }),
                  this.updateEmptyStatus();
              });
          }
          updateItem(itemIndex, quantity) {
            const item = (0, utils_1.$el)(`#CartItem-${itemIndex}`, this);
            if (!item) return;
            if (
              (this.setLoadingStatus(!0),
              +(item.dataset.quantity || 0) === quantity)
            ) {
              item.setLoading(!1), this.setLoadingStatus(!1);
              return;
            }
            item.setDisabled(!0),
              quantity === 0 &&
                (item.removeItem(),
                (0, transition_util_1.whenTransitionEnds)(item, () => {
                  const items = (0, utils_1.$list)(
                    CART_ITEM_SELECTOR,
                    this.element
                  );
                  this.setPreEmpty(items.length === 1);
                })),
              this.emit("start-update", {}),
              this.cartAPI
                .change({
                  ...(0, fetch_config_1.fetchConfig)(),
                  body: JSON.stringify({
                    line: itemIndex + 1,
                    quantity,
                    sections: this.dataset.sectionId,
                    sections_url: window.location.pathname,
                  }),
                })
                .then((state) => {
                  const data = JSON.parse(state);
                  if (data.errors) throw new Error(data.errors);
                  this.lastDrawerBody = this.getTemplateContent(
                    (0, dom_1.parseHTML)(data.sections[this.dataset.sectionId])
                  );
                })
                .catch((error) => {
                  this.error = error;
                })
                .finally(() => {
                  this.mount(),
                    this.emit("update-nodes", { node: this.lastDrawerBody }),
                    this.updateEmptyStatus(),
                    this.initFocus(),
                    item.setLoading(!1),
                    this.setLoadingStatus(!1),
                    item.setDisabled(!1),
                    this.error &&
                      (this.showError(this.error), (this.error = null));
                });
          }
          setLoadingStatus(isLoading) {
            this.classList.toggle("is-cart-loading", isLoading);
          }
          showError(text) {
            const notification = (0, utils_1.$el)(NOTIFICATION_SELECTOR, this),
              message = text || window.auroraThemeLocales.cartStrings.error;
            notification?.show(message, "warning", 6e3);
          }
          async purchaseHandler(html, parsedState) {
            this.setPreEmpty(!1);
            const node = this.getTemplateContent(html);
            this.mount(),
              this.emit("update-nodes", { node, parsedState }),
              this.updateEmptyStatus(),
              await this.open(),
              this.emit("purchase", { parsedState }),
              this.addListener(this, "showAsNew", this.updateLastDrawerBody);
          }
          updateLastDrawerBody = () => {
            this.lastDrawerBody = this.element.cloneNode(!0);
          };
          setPreEmpty(isEmpty) {
            this.classList.toggle("is-pre-empty", isEmpty);
          }
          getTemplateContent(html) {
            const newTemplate = (0, utils_1.$el)(
              `[data-sidebar-template="${this.id}"]`,
              html
            );
            return (0, dom_1.getTemplateFirstChild)(newTemplate);
          }
          updateEmptyStatus() {
            const items = (0, utils_1.$list)(CART_ITEM_SELECTOR, this.element);
            this.hasAttribute("data-has-warning-placeholder") &&
              this.toggleAttribute("is-empty", items.length === 0),
              items.length === 0 && this.emit("cartIsEmpty", {});
          }
          updateAsideProductsByParsedState(parsedState) {
            this.toggleAttribute(
              "has-aside-products",
              parsedState.quantity > 0
            );
          }
          async open() {
            await super.open(),
              (this.lastDrawerBody = this.element.cloneNode(!0));
          }
        }
        exports.CartDrawer = CartDrawer;
      },
      9223: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartDrawer =
            exports.CartDrawerTimerBlock =
            exports.CartDrawerRelatedProductsBlock =
            exports.CartDrawerRelatedProducts =
            exports.CartDrawerItemsBlock =
            exports.CartDrawerInCartBannerBlock =
            exports.CartDrawerHeader =
            exports.CartDrawerFreeShippingBarBlock =
            exports.CartDrawerFooter =
            exports.CartDrawerButtonsBlock =
              void 0);
        var cart_drawer_buttons_block_1 = __webpack_require__2(8733);
        Object.defineProperty(exports, "CartDrawerButtonsBlock", {
          enumerable: !0,
          get: function () {
            return cart_drawer_buttons_block_1.CartDrawerButtonsBlock;
          },
        });
        var cart_drawer_footer_1 = __webpack_require__2(8640);
        Object.defineProperty(exports, "CartDrawerFooter", {
          enumerable: !0,
          get: function () {
            return cart_drawer_footer_1.CartDrawerFooter;
          },
        });
        var cart_drawer_free_shipping_bar_block_1 = __webpack_require__2(2715);
        Object.defineProperty(exports, "CartDrawerFreeShippingBarBlock", {
          enumerable: !0,
          get: function () {
            return cart_drawer_free_shipping_bar_block_1.CartDrawerFreeShippingBarBlock;
          },
        });
        var cart_drawer_header_1 = __webpack_require__2(4029);
        Object.defineProperty(exports, "CartDrawerHeader", {
          enumerable: !0,
          get: function () {
            return cart_drawer_header_1.CartDrawerHeader;
          },
        });
        var cart_drawer_in_cart_banner_block_1 = __webpack_require__2(358);
        Object.defineProperty(exports, "CartDrawerInCartBannerBlock", {
          enumerable: !0,
          get: function () {
            return cart_drawer_in_cart_banner_block_1.CartDrawerInCartBannerBlock;
          },
        });
        var cart_drawer_items_block_1 = __webpack_require__2(2411);
        Object.defineProperty(exports, "CartDrawerItemsBlock", {
          enumerable: !0,
          get: function () {
            return cart_drawer_items_block_1.CartDrawerItemsBlock;
          },
        });
        var cart_drawer_related_products_1 = __webpack_require__2(3255);
        Object.defineProperty(exports, "CartDrawerRelatedProducts", {
          enumerable: !0,
          get: function () {
            return cart_drawer_related_products_1.CartDrawerRelatedProducts;
          },
        });
        var cart_drawer_related_products_block_1 = __webpack_require__2(8476);
        Object.defineProperty(exports, "CartDrawerRelatedProductsBlock", {
          enumerable: !0,
          get: function () {
            return cart_drawer_related_products_block_1.CartDrawerRelatedProductsBlock;
          },
        });
        var cart_drawer_timer_block_1 = __webpack_require__2(5198);
        Object.defineProperty(exports, "CartDrawerTimerBlock", {
          enumerable: !0,
          get: function () {
            return cart_drawer_timer_block_1.CartDrawerTimerBlock;
          },
        });
        var cart_drawer_1 = __webpack_require__2(4626);
        Object.defineProperty(exports, "CartDrawer", {
          enumerable: !0,
          get: function () {
            return cart_drawer_1.CartDrawer;
          },
        });
      },
      3828: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartAppBlock = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          CART_PAGE_SELECTOR = "cart-page";
        class CartAppBlock extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.on(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          unmountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.off(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          handleCartUpdate = ({ node }) => {
            (0, dom_1.replaceNodeChildren)(
              this,
              (0, utils_1.$el)(
                `cart-app-block[block-id="${this.getAttribute("block-id")}"]`,
                node
              )
            );
          };
        }
        exports.CartAppBlock = CartAppBlock;
      },
      5151: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartButtonsBlock = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          CART_PAGE_SELECTOR = "cart-page",
          CHECKOUT_BUTTON_SELECTOR = "[data-cart-page-checkout-button]";
        class CartButtonsBlock extends base_component_1.BaseComponent {
          mountComponent() {
            const cart = (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this);
            cart?.on("start-update", this.handleStartCartUpdate),
              cart?.on("stop-update", this.handleStopUpdate),
              cart?.on("update-nodes", this.handleCartUpdate);
          }
          unmountComponent() {
            const cart = (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this);
            cart?.off("start-update", this.handleStartCartUpdate),
              cart?.off("stop-update", this.handleStopUpdate),
              cart?.off("update-nodes", this.handleCartUpdate);
          }
          handleStartCartUpdate = () => {
            this.setLoading(!0);
          };
          handleCartUpdate = ({ node }) => {
            this.setLoading(!1),
              (0, dom_1.replaceNodeChildren)(
                this,
                (0, utils_1.$el)(
                  `cart-buttons-block[block-id="${this.getAttribute(
                    "block-id"
                  )}"]`,
                  node
                )
              );
          };
          handleStopUpdate = () => {
            this.setLoading(!1);
          };
          setLoading(isLoading) {
            const button = (0, utils_1.$el)(CHECKOUT_BUTTON_SELECTOR, this);
            button?.toggleAttribute("disabled", isLoading),
              button?.classList.toggle("loading", isLoading);
          }
        }
        exports.CartButtonsBlock = CartButtonsBlock;
      },
      7684: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartCountdownBlock = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          CART_PAGE_SELECTOR = "cart-page";
        class CartCountdownBlock extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.on(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          unmountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.off(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          handleCartUpdate = ({ node }) => {
            (0, dom_1.replaceNodeChildren)(
              this,
              (0, utils_1.$el)(
                `cart-countdown-block[block-id="${this.getAttribute(
                  "block-id"
                )}"]`,
                node
              )
            );
          };
        }
        exports.CartCountdownBlock = CartCountdownBlock;
      },
      5504: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartFreeShippingBarBlock = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          CART_PAGE_SELECTOR = "cart-page",
          FREE_SHIPPING_BAR = "free-shipping-bar";
        class CartFreeShippingBarBlock extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.on(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          unmountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.off(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          handleCartUpdate = (data) => {
            const bar = (0, utils_1.$el)(FREE_SHIPPING_BAR, this),
              newBar = (0, utils_1.$el)(FREE_SHIPPING_BAR, data.node);
            if (!bar || !newBar) return;
            const difference =
                newBar.getAttribute("data-free-shipping-difference") || "",
              differencePercent = +(
                newBar.getAttribute("data-free-shipping-difference-percent") ||
                0
              );
            bar.updateProgressByDifference(difference, differencePercent);
          };
        }
        exports.CartFreeShippingBarBlock = CartFreeShippingBarBlock;
      },
      3604: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartInCartBannerBlock = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          CART_PAGE_SELECTOR = "cart-page";
        class CartInCartBannerBlock extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.on(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          unmountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.off(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          handleCartUpdate = ({ node }) => {
            (0, dom_1.replaceNodeChildren)(
              this,
              (0, utils_1.$el)(
                `cart-in-cart-banner-block[block-id="${this.getAttribute(
                  "block-id"
                )}"]`,
                node
              )
            );
          };
        }
        exports.CartInCartBannerBlock = CartInCartBannerBlock;
      },
      4475: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartItem = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          CHECKMARK_SELECTOR = "[data-cart-item-checkmark]",
          QUANTITY_SELECTOR = "[data-cart-item-quantity]";
        class CartItem extends base_component_1.BaseComponent {
          mountComponent() {
            this.setHeight(this.hasAttribute("is-new") ? 0 : this.scrollHeight);
          }
          async removeItem() {
            await this.collapse();
          }
          async expand() {
            this.setHeight(this.scrollHeight),
              await (0, utils_1.transitionToPromise)(this);
          }
          async collapse() {
            this.setHeight(0), await (0, utils_1.transitionToPromise)(this);
          }
          async showAsNew() {
            await this.expand(),
              this.removeAttribute("is-new"),
              this.dispatchEvent(new Event("showAsNew", { bubbles: !0 }));
          }
          showCheckmark = () => {
            const checkmark = (0, utils_1.$el)(CHECKMARK_SELECTOR, this);
            checkmark?.classList.remove("hidden"),
              (0, utils_1.delay)(2500).then(() => {
                checkmark?.classList.add("hidden");
              });
          };
          setLoading = (isLoading) => {
            this?.toggleAttribute("is-loading", isLoading);
          };
          setHeight(maxHeight) {
            this.style.maxHeight = `${Math.ceil(maxHeight)}px`;
          }
          setDisabled(isDisable) {
            (0, utils_1.$el)(QUANTITY_SELECTOR, this)?.setDisable(isDisable);
          }
        }
        exports.CartItem = CartItem;
      },
      3882: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartItemsBlock = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          CART_PAGE_SELECTOR = "cart-page";
        class CartItemsBlock extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.on(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          unmountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.off(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          handleCartUpdate = ({ node }) => {
            (0, dom_1.replaceNodeChildren)(
              this,
              (0, utils_1.$el)(
                `cart-items-block[block-id="${this.getAttribute("block-id")}"]`,
                node
              )
            ),
              (0, utils_1.isNotThemeStore)() &&
                this.scrollIntoView({ behavior: "smooth" });
          };
        }
        exports.CartItemsBlock = CartItemsBlock;
      },
      3699: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartNote = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          TEXTAREA_SELECTOR = "[data-cart-note-textarea]",
          LOCAL_STORAGE_SELECTOR = "cartNote",
          CART_SELECTOR = "cart-page",
          CART_DRAWER_SELECTOR = "cart-drawer";
        class CartNote extends base_component_1.BaseComponent {
          valueFromLS;
          currentValue;
          mountComponent() {
            const cartDrawer = (0, utils_1.$elParent)(
                CART_DRAWER_SELECTOR,
                this
              ),
              cart = (0, utils_1.$elParent)(CART_SELECTOR, this),
              textarea = (0, utils_1.$el)(TEXTAREA_SELECTOR, this);
            (this.currentValue = textarea?.value),
              this.updateByLocalStorage(),
              this.addListener(textarea, "blur", this.handleTextareaBlur),
              this.addListener(window, "storage", this.handleBetweenTabsUpdate),
              (0, utils_1.whenDefined)(CART_SELECTOR).then(() =>
                cart?.on("cartIsEmpty", this.handleCartStatusUpdate)
              ),
              (0, utils_1.whenDefined)(CART_DRAWER_SELECTOR).then(() =>
                cartDrawer?.on("cartIsEmpty", this.handleCartStatusUpdate)
              );
          }
          unmountComponent() {
            const cartDrawer = (0, utils_1.$elParent)(
                CART_DRAWER_SELECTOR,
                this
              ),
              cart = (0, utils_1.$elParent)(CART_SELECTOR, this);
            (0, utils_1.whenDefined)(CART_SELECTOR).then(() =>
              cart?.off("cartIsEmpty", this.handleCartStatusUpdate)
            ),
              (0, utils_1.whenDefined)(CART_DRAWER_SELECTOR).then(() =>
                cartDrawer?.off("cartIsEmpty", this.handleCartStatusUpdate)
              );
          }
          handleTextareaBlur = (event) => {
            const { value } = event.target;
            value &&
              (localStorage.setItem(LOCAL_STORAGE_SELECTOR, value),
              (this.currentValue = value));
          };
          updateByLocalStorage = () => {
            const textarea = (0, utils_1.$el)(TEXTAREA_SELECTOR, this);
            (this.valueFromLS = localStorage.getItem(LOCAL_STORAGE_SELECTOR)),
              this.valueFromLS !== this.currentValue &&
                ((textarea.value = this.valueFromLS),
                (this.currentValue = this.valueFromLS));
          };
          handleBetweenTabsUpdate = (event) => {
            event.key === LOCAL_STORAGE_SELECTOR && this.updateByLocalStorage();
          };
          handleCartStatusUpdate = () => {
            this.clearValueFromLS();
          };
          clearValueFromLS = () => {
            localStorage.removeItem(LOCAL_STORAGE_SELECTOR),
              (this.currentValue = void 0);
          };
        }
        exports.CartNote = CartNote;
      },
      5629: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartOrderNotesBlock = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          CART_PAGE_SELECTOR = "cart-page";
        class CartOrderNotesBlock extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.on(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          unmountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.off(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          handleCartUpdate = ({ node }) => {
            (0, dom_1.replaceNodeChildren)(
              this,
              (0, utils_1.$el)(
                `cart-order-notes-block[block-id="${this.getAttribute(
                  "block-id"
                )}"]`,
                node
              )
            );
          };
        }
        exports.CartOrderNotesBlock = CartOrderNotesBlock;
      },
      145: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartRelatedProductsBlock = void 0);
        const dom_1 = __webpack_require__2(3889),
          base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          RELATED_PRODUCTS_SELECTOR = "[data-cart-related-products]",
          CART_PAGE_SELECTOR = "cart-page";
        class CartRelatedProductsBlock extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.on(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          unmountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.off(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          handleCartUpdate = ({ node }) => {
            const relatedProducts = (0, utils_1.$el)(
                RELATED_PRODUCTS_SELECTOR,
                this
              ),
              newRelatedProducts = (0, utils_1.$el)(
                `cart-related-products-block[block-id="${this.getAttribute(
                  "block-id"
                )}"] [data-cart-related-products]`,
                node
              ),
              isAuto = this.hasAttribute("is-auto-recommendations");
            if (!(!relatedProducts || !newRelatedProducts))
              if (isAuto) {
                const newUrl = newRelatedProducts.getAttribute("data-url");
                relatedProducts.setAttribute("data-url", newUrl),
                  newUrl
                    ? (relatedProducts.loadProducts(),
                      (0, dom_1.showElement)(this))
                    : (relatedProducts.erase(), (0, dom_1.hideElement)(this));
              } else
                (0, dom_1.replaceNodeChildren)(
                  relatedProducts,
                  newRelatedProducts
                );
          };
        }
        exports.CartRelatedProductsBlock = CartRelatedProductsBlock;
      },
      7813: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartRelatedProducts = void 0);
        const dom_1 = __webpack_require__2(3889),
          base_component_1 = __webpack_require__2(3608),
          dom_2 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          LOADING_OVERLAY_SELECTOR = ".loading-overlay";
        class CartRelatedProducts extends base_component_1.BaseComponent {
          prevUrl;
          mountComponent() {
            this.loadProducts();
          }
          erase() {
            this.replaceChildren(), this.setReady(!1);
          }
          loadProducts() {
            if (
              this.prevUrl !== this.dataset.url &&
              ((this.prevUrl = this.dataset.url), !!this.dataset.url)
            )
              return (
                this.showPreloader(),
                fetch(this.dataset.url)
                  .then((response) => response.text())
                  .then((text) => {
                    this.hidePreloader(),
                      this.updateByHTML((0, dom_1.parseHTML)(text));
                  })
                  .catch(() => {
                    console.log("Error in cart related products");
                  })
              );
          }
          updateByHTML = (node) => {
            const recommendations = (0, utils_1.$el)(`#${this.id}`, node);
            (0, dom_1.replaceNodeChildren)(this, recommendations);
            const products = (0, utils_1.$list)("vertical-product-card", this);
            this.setReady(products.length > 0);
          };
          setReady(isReady) {
            this.toggleAttribute("is-ready", isReady);
          }
          showPreloader() {
            const loadingOverlay = (0, utils_1.$el)(
              LOADING_OVERLAY_SELECTOR,
              this
            );
            (0, dom_2.showElement)(loadingOverlay);
          }
          hidePreloader() {
            const loadingOverlay = (0, utils_1.$el)(
              LOADING_OVERLAY_SELECTOR,
              this
            );
            (0, dom_2.hideElement)(loadingOverlay);
          }
        }
        exports.CartRelatedProducts = CartRelatedProducts;
      },
      4287: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartRemoveButton = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650);
        class CartRemoveButton extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "keydown", this.handleKeyDown),
              this.addListener(this, "click", this.handleButtonClick);
          }
          handleButtonClick = (event) => {
            event.preventDefault(), this.update();
          };
          handleKeyDown = (event) => {
            (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.update());
          };
          update() {
            const cart = (0, utils_1.$elParent)("cart-page, cart-drawer", this),
              index = this.dataset.index;
            cart && index && cart.updateItem(+index, 0);
          }
        }
        exports.CartRemoveButton = CartRemoveButton;
      },
      8261: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartSubtotalBlock = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          CART_PAGE_SELECTOR = "cart-page";
        class CartSubtotalBlock extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.on(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          unmountComponent() {
            (0, utils_1.$elParent)(CART_PAGE_SELECTOR, this)?.off(
              "update-nodes",
              this.handleCartUpdate
            );
          }
          handleCartUpdate = ({ node }) => {
            (0, dom_1.replaceNodeChildren)(
              this,
              (0, utils_1.$el)(
                `cart-subtotal-block[block-id="${this.getAttribute(
                  "block-id"
                )}"]`,
                node
              )
            );
          };
        }
        exports.CartSubtotalBlock = CartSubtotalBlock;
      },
      1678: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartPage = void 0);
        const base_component_1 = __webpack_require__2(3608),
          cart_api_1 = __webpack_require__2(735),
          fetch_config_1 = __webpack_require__2(8548),
          dom_1 = __webpack_require__2(3889),
          debounce_1 = __webpack_require__2(2731),
          utils_1 = __webpack_require__2(4083),
          BODY_ELEMENT_SELECTOR = "body-element";
        class CartPage extends base_component_1.BaseComponent {
          cartAPI = new cart_api_1.CartAPI();
          cartState;
          mountComponent() {
            this.setCartState(),
              this.addListener(this, "change", this.handleCartChange),
              this.addListener(this, "change", this.handleItemChange);
          }
          handleItemChange = (event) => {
            (0, utils_1.$el)(
              `#CartItem-${+event.target.dataset.index}`,
              this
            )?.setLoading(!0),
              this.setLoadingStatus(!0);
          };
          handleCartChange = (0, debounce_1.debounce)((event) => {
            this.updateItem(+event.target.dataset.index, event.target.value);
          }, 500);
          setCartState = () => {
            this.cartState = this.cloneNode(!0);
          };
          resetToPrevCartState = () => {
            this.replaceWith(this.cartState);
          };
          updateItem(itemIndex, quantity) {
            const item = (0, utils_1.$el)(`#CartItem-${itemIndex}`);
            if (!item) return;
            if (
              (this.setLoadingStatus(!0),
              +(item.dataset.quantity || 0) === +quantity)
            ) {
              item.setLoading(!1), this.setLoadingStatus(!1);
              return;
            }
            if (+quantity == 0) {
              const items = (0, utils_1.$list)("cart-item", this);
              this.updateEmptyStatus(items.length === 1), item.removeItem();
            }
            this.emit("start-update", {}),
              item.setDisabled(!0),
              this.cartAPI
                .change({
                  ...(0, fetch_config_1.fetchConfig)(),
                  body: JSON.stringify({
                    line: itemIndex + 1,
                    quantity,
                    sections: this.dataset.sectionId,
                    sections_url: window.location.pathname,
                  }),
                })
                .then((state) => {
                  item.setDisabled(!1),
                    item.setLoading(!1),
                    this.setLoadingStatus(!1),
                    this.emit("update-nodes", {
                      node: (0, dom_1.parseHTML)(
                        JSON.parse(state).sections[this.dataset.sectionId]
                      ),
                    }),
                    this.setCartState();
                })
                .catch(() => {
                  this.showError(),
                    item.setDisabled(!1),
                    item.setLoading(!1),
                    this.setLoadingStatus(!1),
                    this.emit("stop-update", {}),
                    this.resetToPrevCartState();
                });
          }
          setLoadingStatus(isLoading) {
            this.classList.toggle("is-cart-loading", isLoading);
          }
          async purchaseHandler(html, parsedState) {
            this.emit("update-nodes", { node: html });
            const item = (0, utils_1.$el)(
              `cart-item[data-variant-id="${parsedState.id}"]`,
              this
            );
            item &&
              (parsedState.quantity === 1 && (await item.showAsNew()),
              item.showCheckmark());
          }
          showError() {
            (0, utils_1.$el)(BODY_ELEMENT_SELECTOR).showNotification(
              window.auroraThemeLocales.cartStrings.error,
              "warning"
            );
          }
          updateEmptyStatus(isEmpty) {
            this.classList.toggle("is-empty", isEmpty),
              isEmpty && this.emit("cartIsEmpty", {});
          }
        }
        exports.CartPage = CartPage;
      },
      1636: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CartPage =
            exports.CartSubtotalBlock =
            exports.CartRemoveButton =
            exports.CartRelatedProductsBlock =
            exports.CartRelatedProducts =
            exports.CartOrderNotesBlock =
            exports.CartNote =
            exports.CartItemsBlock =
            exports.CartItem =
            exports.CartInCartBannerBlock =
            exports.CartFreeShippingBarBlock =
            exports.CartCountdownBlock =
            exports.CartButtonsBlock =
            exports.CartAppBlock =
              void 0);
        var cart_app_block_1 = __webpack_require__2(3828);
        Object.defineProperty(exports, "CartAppBlock", {
          enumerable: !0,
          get: function () {
            return cart_app_block_1.CartAppBlock;
          },
        });
        var cart_buttons_block_1 = __webpack_require__2(5151);
        Object.defineProperty(exports, "CartButtonsBlock", {
          enumerable: !0,
          get: function () {
            return cart_buttons_block_1.CartButtonsBlock;
          },
        });
        var cart_countdown_block_1 = __webpack_require__2(7684);
        Object.defineProperty(exports, "CartCountdownBlock", {
          enumerable: !0,
          get: function () {
            return cart_countdown_block_1.CartCountdownBlock;
          },
        });
        var cart_free_shipping_bar_block_1 = __webpack_require__2(5504);
        Object.defineProperty(exports, "CartFreeShippingBarBlock", {
          enumerable: !0,
          get: function () {
            return cart_free_shipping_bar_block_1.CartFreeShippingBarBlock;
          },
        });
        var cart_in_cart_banner_block_1 = __webpack_require__2(3604);
        Object.defineProperty(exports, "CartInCartBannerBlock", {
          enumerable: !0,
          get: function () {
            return cart_in_cart_banner_block_1.CartInCartBannerBlock;
          },
        });
        var cart_item_1 = __webpack_require__2(4475);
        Object.defineProperty(exports, "CartItem", {
          enumerable: !0,
          get: function () {
            return cart_item_1.CartItem;
          },
        });
        var cart_items_block_1 = __webpack_require__2(3882);
        Object.defineProperty(exports, "CartItemsBlock", {
          enumerable: !0,
          get: function () {
            return cart_items_block_1.CartItemsBlock;
          },
        });
        var cart_note_1 = __webpack_require__2(3699);
        Object.defineProperty(exports, "CartNote", {
          enumerable: !0,
          get: function () {
            return cart_note_1.CartNote;
          },
        });
        var cart_order_notes_block_1 = __webpack_require__2(5629);
        Object.defineProperty(exports, "CartOrderNotesBlock", {
          enumerable: !0,
          get: function () {
            return cart_order_notes_block_1.CartOrderNotesBlock;
          },
        });
        var cart_related_products_1 = __webpack_require__2(7813);
        Object.defineProperty(exports, "CartRelatedProducts", {
          enumerable: !0,
          get: function () {
            return cart_related_products_1.CartRelatedProducts;
          },
        });
        var cart_related_products_block_1 = __webpack_require__2(145);
        Object.defineProperty(exports, "CartRelatedProductsBlock", {
          enumerable: !0,
          get: function () {
            return cart_related_products_block_1.CartRelatedProductsBlock;
          },
        });
        var cart_remove_btn_1 = __webpack_require__2(4287);
        Object.defineProperty(exports, "CartRemoveButton", {
          enumerable: !0,
          get: function () {
            return cart_remove_btn_1.CartRemoveButton;
          },
        });
        var cart_subtotal_block_1 = __webpack_require__2(8261);
        Object.defineProperty(exports, "CartSubtotalBlock", {
          enumerable: !0,
          get: function () {
            return cart_subtotal_block_1.CartSubtotalBlock;
          },
        });
        var cart_1 = __webpack_require__2(1678);
        Object.defineProperty(exports, "CartPage", {
          enumerable: !0,
          get: function () {
            return cart_1.CartPage;
          },
        });
      },
      3513: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ColumnSwitcher = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          ITEM_SELECTOR = "[data-column-switcher-item]",
          TARGET_SELECTOR = "[data-column-switcher-target]";
        class ColumnSwitcher extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$list)(ITEM_SELECTOR, this).forEach((item) => {
              this.addListener(item, "keydown", this.handleKeyDown),
                this.addListener(item, "click", this.handleItemClick);
            }),
              this.isEditor
                ? this.editor.on("SECTION_LOAD", this.handleSectionLoad)
                : this.init();
          }
          handleSectionLoad = (event) => {
            this.dataset.sectionId === event.detail.sectionId && this.reset();
          };
          handleItemClick = (event) => {
            event.preventDefault();
            const item = (0, utils_1.$elParent)(ITEM_SELECTOR, event.target);
            item && this.updateByCount(+(item.dataset.value || 1));
          };
          handleKeyDown = (event) => {
            if ((0, key_1.isEnterKey)(event)) {
              event.preventDefault();
              const item = (0, utils_1.$elParent)(ITEM_SELECTOR, event.target);
              item && this.updateByCount(+(item.dataset.value || 1));
            }
          };
          updateByCount(newCount) {
            this.setIndicator(newCount), this.updateGrid(newCount);
          }
          setIndicator(columnCount) {
            (0, utils_1.$list)(ITEM_SELECTOR, this).forEach((item) => {
              const value = +(item.getAttribute("data-value") || 1);
              item.classList.toggle("selected", value === columnCount);
            });
          }
          updateGrid(value) {
            const target = (0, utils_1.$elParent)(TARGET_SELECTOR, this);
            target &&
              (target.style.setProperty(
                `--gsc-${this.dataset.columnSwitcherCssVariable}`,
                value.toString()
              ),
              localStorage.setItem(
                `products-${this.dataset.columnSwitcherCssVariable}`,
                value.toString()
              ));
          }
          init() {
            const value = localStorage.getItem(
              `products-${this.dataset.columnSwitcherCssVariable}`
            );
            if (!value || value === "null") return;
            const preparedValue = Number(value);
            preparedValue > 0 && this.updateByCount(preparedValue);
          }
          reset() {
            this.dataset.default &&
              this.updateByCount(Number(this.dataset.default));
          }
        }
        exports.ColumnSwitcher = ColumnSwitcher;
      },
      7794: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.FilterRemoveBtn = void 0);
        const base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          utils_1 = __webpack_require__2(4083),
          ACTIVE_FILTERS_SELECTOR = "shop-active-filters",
          SHOP_COMPONENT_SELECTOR = "shop-component";
        class FilterRemoveBtn extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "keydown", this.handleKeyDown),
              this.addListener(this, "click", this.handleButtonClick);
          }
          handleButtonClick = (event) => {
            event.preventDefault(), this.update();
          };
          handleKeyDown = (event) => {
            (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.update());
          };
          update() {
            this.updateShop(), this.updateActiveFilters();
          }
          updateShop() {
            const isResetButton = this.hasAttribute("data-filters-reset"),
              shop = (0, utils_1.$el)(SHOP_COMPONENT_SELECTOR),
              url = this.dataset.url || "";
            let preparedSearchParams;
            shop &&
              (isResetButton
                ? ((preparedSearchParams = ""), shop.reset())
                : (preparedSearchParams =
                    url.indexOf("?") === -1
                      ? ""
                      : url.slice(url.indexOf("?") + 1)),
              shop.updateBySearchParams(preparedSearchParams));
          }
          updateActiveFilters() {
            const activeFilters = (0, utils_1.$el)(ACTIVE_FILTERS_SELECTOR);
            if (activeFilters) {
              const isRemoveButton = this.hasAttribute(
                "data-filter-remove-btn"
              );
              this.hasAttribute("data-filters-reset") && activeFilters.reset(),
                isRemoveButton &&
                  (activeFilters.buttons.length === 1
                    ? activeFilters.reset()
                    : (activeFilters.setDisable(), this.remove()));
            }
          }
        }
        exports.FilterRemoveBtn = FilterRemoveBtn;
      },
      4980: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.FiltersSubmitBtn = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          SHOP_COMPONENT_SELECTOR = "shop-component",
          SIDEBAR_COMPONENT_SELECTOR = "#SidebarFiltersMobile";
        class FiltersSubmitBtn extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "click", this.handleButtonClick);
          }
          handleButtonClick = (event) => {
            event.preventDefault();
            const shop = (0, utils_1.$el)(SHOP_COMPONENT_SELECTOR),
              sidebar = (0, utils_1.$elParent)(
                SIDEBAR_COMPONENT_SELECTOR,
                this
              );
            if (shop && sidebar) {
              const searchParams = [shop.filterQuery, shop.sortQuery].join("&"),
                preparedUrl = `${window.location.pathname}?${
                  shop.formatParams(searchParams) || ""
                }`;
              shop.updateURL(searchParams, preparedUrl),
                shop.updateShop(preparedUrl),
                sidebar.hide();
            }
          };
        }
        exports.FiltersSubmitBtn = FiltersSubmitBtn;
      },
      3389: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ShopComponent =
            exports.SortList =
            exports.SidebarFiltersStickyMobileButton =
            exports.SidebarFiltersMobile =
            exports.SidebarFiltersDesktop =
            exports.SidebarFilters =
            exports.ShopActiveFilters =
            exports.PriceRange =
            exports.ListBtn =
            exports.ListComponent =
            exports.FiltersSubmitBtn =
            exports.FilterRemoveBtn =
            exports.ColumnSwitcher =
              void 0);
        var column_switcher_1 = __webpack_require__2(3513);
        Object.defineProperty(exports, "ColumnSwitcher", {
          enumerable: !0,
          get: function () {
            return column_switcher_1.ColumnSwitcher;
          },
        });
        var filter_remove_btn_1 = __webpack_require__2(7794);
        Object.defineProperty(exports, "FilterRemoveBtn", {
          enumerable: !0,
          get: function () {
            return filter_remove_btn_1.FilterRemoveBtn;
          },
        });
        var filters_submit_btn_1 = __webpack_require__2(4980);
        Object.defineProperty(exports, "FiltersSubmitBtn", {
          enumerable: !0,
          get: function () {
            return filters_submit_btn_1.FiltersSubmitBtn;
          },
        });
        var list_1 = __webpack_require__2(9790);
        Object.defineProperty(exports, "ListComponent", {
          enumerable: !0,
          get: function () {
            return list_1.ListComponent;
          },
        });
        var list_btn_1 = __webpack_require__2(2772);
        Object.defineProperty(exports, "ListBtn", {
          enumerable: !0,
          get: function () {
            return list_btn_1.ListBtn;
          },
        });
        var price_range_1 = __webpack_require__2(2874);
        Object.defineProperty(exports, "PriceRange", {
          enumerable: !0,
          get: function () {
            return price_range_1.PriceRange;
          },
        });
        var shop_active_filters_1 = __webpack_require__2(5513);
        Object.defineProperty(exports, "ShopActiveFilters", {
          enumerable: !0,
          get: function () {
            return shop_active_filters_1.ShopActiveFilters;
          },
        });
        var sidebar_filters_1 = __webpack_require__2(8030);
        Object.defineProperty(exports, "SidebarFilters", {
          enumerable: !0,
          get: function () {
            return sidebar_filters_1.SidebarFilters;
          },
        });
        var sidebar_filters_desktop_1 = __webpack_require__2(1184);
        Object.defineProperty(exports, "SidebarFiltersDesktop", {
          enumerable: !0,
          get: function () {
            return sidebar_filters_desktop_1.SidebarFiltersDesktop;
          },
        });
        var sidebar_filters_mobile_1 = __webpack_require__2(9246);
        Object.defineProperty(exports, "SidebarFiltersMobile", {
          enumerable: !0,
          get: function () {
            return sidebar_filters_mobile_1.SidebarFiltersMobile;
          },
        });
        var sidebar_filters_mobile_sticky_button_1 = __webpack_require__2(7607);
        Object.defineProperty(exports, "SidebarFiltersStickyMobileButton", {
          enumerable: !0,
          get: function () {
            return sidebar_filters_mobile_sticky_button_1.SidebarFiltersStickyMobileButton;
          },
        });
        var sort_list_1 = __webpack_require__2(8590);
        Object.defineProperty(exports, "SortList", {
          enumerable: !0,
          get: function () {
            return sort_list_1.SortList;
          },
        });
        var shop_1 = __webpack_require__2(2993);
        Object.defineProperty(exports, "ShopComponent", {
          enumerable: !0,
          get: function () {
            return shop_1.ShopComponent;
          },
        });
      },
      2772: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ListBtn = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          LIST_SELECTOR = "list-component";
        class ListBtn extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "keydown", this.handleKeyDown),
              this.addListener(this, "click", this.handleButtonClick);
          }
          handleButtonClick = (event) => {
            event.preventDefault(), this.update();
          };
          handleKeyDown = (event) => {
            (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.update());
          };
          update() {
            const list = (0, utils_1.$elParent)(LIST_SELECTOR, this);
            this.dataset.trigger === "collapse"
              ? list?.collapse()
              : list?.expand();
          }
        }
        exports.ListBtn = ListBtn;
      },
      9790: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ListComponent = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          ITEM_SELECTOR = "[data-list-item]",
          EXPAND_BTN_SELECTOR = 'list-btn[data-trigger="expand"]',
          COLLAPSE_BTN_SELECTOR = 'list-btn[data-trigger="collapse"]',
          VISIBLE_ITEM_SELECTOR = `${ITEM_SELECTOR}:not(.hidden)`,
          HIDDEN_ITEM_SELECTOR = `${ITEM_SELECTOR}.hidden`;
        class ListComponent extends base_component_1.BaseComponent {
          initialHeight;
          maxHeight;
          setInitialHeight() {
            (this.initialHeight = Math.ceil(this.offsetHeight)),
              (this.style.maxHeight = `${this.initialHeight}px`);
          }
          setHeight() {
            (this.maxHeight = Math.ceil(this.scrollHeight)),
              (this.style.maxHeight = `${this.maxHeight}px`);
          }
          collapse = () => {
            const expandBtn = (0, utils_1.$el)(EXPAND_BTN_SELECTOR, this),
              collapseBtn = (0, utils_1.$el)(COLLAPSE_BTN_SELECTOR, this);
            this.hideItems(),
              (0, dom_1.hideElement)(collapseBtn),
              (0, dom_1.showElement)(expandBtn),
              expandBtn.focus();
          };
          expand = () => {
            const collapseBtn = (0, utils_1.$el)(COLLAPSE_BTN_SELECTOR, this);
            this.initialHeight || this.setInitialHeight(),
              this.showItems(),
              this.tryHideExpandBtn(),
              (0, dom_1.showElement)(collapseBtn),
              collapseBtn.focus(),
              this.setHeight();
          };
          hideItems() {
            const visibleItems = (0, utils_1.$list)(
              VISIBLE_ITEM_SELECTOR,
              this
            );
            (this.style.maxHeight = `${this.initialHeight}px`),
              (0, utils_1.transitionToPromise)(this).then(() => {
                visibleItems.forEach((node, index) => {
                  const initialCount = this.dataset.initialCount
                    ? +this.dataset.initialCount
                    : 0;
                  index + 1 > +initialCount && (0, dom_1.hideElement)(node);
                });
              });
          }
          showItems() {
            (0, utils_1.$list)(HIDDEN_ITEM_SELECTOR, this).forEach(
              (node, index) => {
                const showCount = this.dataset.showCount
                  ? this.dataset.showCount
                  : 0;
                index + 1 < +showCount && (0, dom_1.showElement)(node);
              }
            ),
              (this.style.maxHeight = `${this.maxHeight}px`);
          }
          tryHideExpandBtn() {
            const expandBtn = (0, utils_1.$el)(EXPAND_BTN_SELECTOR, this);
            (0, utils_1.$list)(HIDDEN_ITEM_SELECTOR, this).length === 0 &&
              (0, dom_1.hideElement)(expandBtn);
          }
        }
        exports.ListComponent = ListComponent;
      },
      2874: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PriceRange = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          MIN_RANGE_NUMBER_SELECTOR = "[data-price-min-range-number]",
          MAX_RANGE_NUMBER_SELECTOR = "[data-price-max-range-number]",
          RANGE_INPUTS_WRAPPER_SELECTOR = "[data-price-range-inputs-wrapper]",
          MIN_RANGE_INPUT_SELECTOR = "[data-price-min-range-input]",
          MAX_RANGE_INPUT_SELECTOR = "[data-price-max-range-input]",
          PRICE_RANGE_PROGRESS_SELECTOR = "[data-price-range-progress]";
        class PriceRange extends base_component_1.BaseComponent {
          minNumberInput;
          maxNumberInput;
          rangeWrapper;
          minRangeInput;
          maxRangeInput;
          progress;
          currencyWithoutDecimals;
          numbersAfterComma;
          constructor() {
            super(),
              (this.minNumberInput = (0, utils_1.$el)(
                MIN_RANGE_NUMBER_SELECTOR,
                this
              )),
              (this.maxNumberInput = (0, utils_1.$el)(
                MAX_RANGE_NUMBER_SELECTOR,
                this
              )),
              (this.rangeWrapper = (0, utils_1.$el)(
                RANGE_INPUTS_WRAPPER_SELECTOR,
                this
              )),
              (this.minRangeInput = (0, utils_1.$el)(
                MIN_RANGE_INPUT_SELECTOR,
                this
              )),
              (this.maxRangeInput = (0, utils_1.$el)(
                MAX_RANGE_INPUT_SELECTOR,
                this
              )),
              (this.progress = (0, utils_1.$el)(
                PRICE_RANGE_PROGRESS_SELECTOR,
                this
              ));
          }
          mountComponent() {
            this.minRangeInput &&
              (this.updateMinRangeInput(+this.minRangeInput.value),
              this.updateMinPriceInput(+this.minRangeInput.value)),
              this.maxRangeInput &&
                (this.updateMaxRangeInput(+this.maxRangeInput.value),
                this.updateMaxPriceInput(+this.maxRangeInput.value)),
              this.addListener(
                this.minNumberInput,
                "input",
                this.handleNumberChange
              ),
              this.addListener(
                this.maxNumberInput,
                "input",
                this.handleNumberChange
              ),
              this.addListener(
                this.minRangeInput,
                "input",
                this.handleRangeChange
              ),
              this.addListener(
                this.maxRangeInput,
                "input",
                this.handleRangeChange
              ),
              this.addListener(
                this.rangeWrapper,
                "mouseenter",
                this.handleRangeInput
              ),
              this.addListener(
                this.rangeWrapper,
                "mousemove",
                this.handleRangeInput
              );
          }
          handleRangeInput = (event) => {
            const maxInput = (0, utils_1.$el)(
                "[data-price-range-max-input]",
                this
              ),
              minInput = (0, utils_1.$el)("[data-price-range-min-input]", this);
            if (this.progress && minInput && maxInput) {
              const middleOfProgress =
                  this.progress.offsetLeft + this.progress.offsetWidth / 2,
                isMinInputClosest = event.offsetX < middleOfProgress;
              minInput.toggleAttribute("targeted", isMinInputClosest),
                maxInput.toggleAttribute("targeted", !isMinInputClosest);
            }
          };
          handleNumberChange = () => {
            if (this.minNumberInput && this.maxNumberInput) {
              const minPrice = parseFloat(this.minNumberInput.value),
                maxPrice = parseFloat(this.maxNumberInput.value);
              this.updateMinRangeInput(minPrice),
                this.updateMaxRangeInput(maxPrice);
            }
          };
          handleRangeChange = () => {
            if (this.minRangeInput && this.maxRangeInput) {
              const minVal = parseFloat(this.minRangeInput.value),
                maxVal = parseFloat(this.maxRangeInput.value);
              this.updateMaxPriceInput(maxVal),
                this.updateMaxRangeInput(maxVal),
                this.updateMinPriceInput(minVal),
                this.updateMinRangeInput(minVal);
            }
          };
          updateMaxRangeInput(newValue) {
            const value = Math.ceil(newValue);
            if (this.maxRangeInput && this.progress) {
              const rightPosition =
                100 - (value / +this.maxRangeInput.max) * 100;
              (this.maxRangeInput.value = `${value}`),
                (this.progress.style.right = `${rightPosition}%`);
            }
          }
          updateMinRangeInput(newValue) {
            const value = Math.ceil(newValue);
            this.minRangeInput &&
              this.progress &&
              ((this.minRangeInput.value = `${value}`),
              (this.progress.style.left = `${
                (value / +this.minRangeInput.max) * 100
              }%`));
          }
          updateMaxPriceInput(newValue) {
            const value = Math.ceil(newValue);
            this.maxNumberInput &&
              (this.maxNumberInput.value = value.toFixed(0));
          }
          updateMinPriceInput(newValue) {
            const value = Math.ceil(newValue);
            this.minNumberInput &&
              (this.minNumberInput.value = value.toFixed(0));
          }
        }
        exports.PriceRange = PriceRange;
      },
      5513: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ShopActiveFilters = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          ACTIVE_FILTERS_OPTIONS_SELECTOR =
            "[data-shop-active-filters-options]",
          ACTIVE_FILTERS_REMOVE_BTN_SELECTOR = "[data-filter-remove-btn]";
        class ShopActiveFilters extends base_component_1.BaseComponent {
          reset() {
            this.replaceChildren();
          }
          setDisable() {
            (0, utils_1.$el)(
              ACTIVE_FILTERS_OPTIONS_SELECTOR,
              this
            )?.setAttribute("disabled", "");
          }
          get buttons() {
            return (0, utils_1.$list)(ACTIVE_FILTERS_REMOVE_BTN_SELECTOR, this);
          }
        }
        exports.ShopActiveFilters = ShopActiveFilters;
      },
      2993: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ShopComponent = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          ELEMENTS = [
            "ShopProducts",
            "ShopProductCount",
            "ShopSortList",
            "ShopActiveFilters",
          ],
          PRELOADER_SELECTOR = "#ShopProductsOverlay",
          MOBILE_FILTER_SELECTOR = "#SidebarFiltersMobile",
          DESKTOP_FILTER_SELECTOR = "#SidebarFiltersDesktop";
        class ShopComponent extends base_component_1.BaseComponent {
          searchParamsInitial;
          searchParamsPrev;
          sortQuery = "";
          filterQuery = "";
          constructor() {
            super(),
              (this.searchParamsInitial = window.location.search.slice(1)),
              (this.searchParamsPrev = this.searchParamsInitial);
          }
          mountComponent() {
            this.addListener(window, "popstate", this.handleHistoryChange);
          }
          handleHistoryChange = ({ state: { searchParams } }) => {
            const newSearchParams = searchParams || this.searchParamsInitial;
            newSearchParams !== this.searchParamsPrev &&
              this.updateBySearchParams(newSearchParams);
          };
          formatParams(searchParams) {
            return (
              (this.searchParamsPrev = searchParams),
              `${
                this.dataset.baseParams ? `${this.dataset.baseParams}` : ""
              }${searchParams}`
            );
          }
          updateBySearchParams(searchParams) {
            const baseUrl = window.location.pathname,
              params = `${this.formatParams(
                searchParams ? `${searchParams}` : ""
              )}`,
              url = baseUrl + "?" + params;
            this.updateURL(searchParams, url),
              this.updateShop(url),
              this.updateFilters(url);
          }
          async getFromUrl(url) {
            const preloaderElement = (0, utils_1.$el)(PRELOADER_SELECTOR, this);
            return (
              preloaderElement.classList.remove("hidden"),
              fetch(url)
                .then((response) => response.text())
                .then(
                  (responseText) => (
                    preloaderElement.classList.add("hidden"),
                    (0, dom_1.parseHTML)(responseText)
                  )
                )
                .catch(() => console.log("Error in shop component"))
            );
          }
          updateShop(url) {
            this.getFromUrl(url).then((html) => {
              ELEMENTS.forEach((elementId) => {
                const element = (0, utils_1.$el)(`#${elementId}`),
                  newElement = (0, utils_1.$el)(`#${elementId}`, html);
                (0, dom_1.replaceNodeChildren)(element, newElement);
              });
            });
          }
          updateFilters(url) {
            const filters = (0, utils_1.$list)(
              `${MOBILE_FILTER_SELECTOR}, ${DESKTOP_FILTER_SELECTOR}`
            );
            filters.forEach((filter) => {
              filter.preloader.classList.remove("hidden");
            }),
              this.getFromUrl(url).then((html) => {
                filters.forEach((filter) => {
                  filter.updateHTML(html),
                    filter.preloader.classList.add("hidden");
                }),
                  this.emit("filtersUpdated", {});
              });
          }
          updateURL(searchParams, url) {
            history.pushState({ searchParams }, "", url);
          }
          reset() {
            (this.sortQuery = ""), (this.filterQuery = "");
          }
        }
        exports.ShopComponent = ShopComponent;
      },
      1184: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SidebarFiltersDesktop = void 0);
        const utils_1 = __webpack_require__2(4083),
          sidebar_filters_1 = __webpack_require__2(8030),
          SHOP_SELECTOR = "shop-component",
          BODY_ELEMENT_SELECTOR = "body-element";
        class SidebarFiltersDesktop extends sidebar_filters_1.SidebarFilters {
          handleSectionLoad = () => {};
          change() {
            const shop = (0, utils_1.$el)(SHOP_SELECTOR);
            shop &&
              (this.createQuery(),
              shop.updateBySearchParams(this.searchParams));
          }
          async open(event) {
            const bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR);
            this.hasAttribute("is-embed-filters") && window.scrollY > 0
              ? (bodyElement.setScrollLock(),
                await super.open(event),
                bodyElement.unsetScrollLock())
              : await super.open(event);
          }
          handleSidebarFocusout = (event) => {
            const focusTarget = event.relatedTarget;
            if (
              !this.hasAttribute("is-embed-filters") &&
              (!focusTarget || !this.contains(focusTarget))
            ) {
              const { firstTarget } = (0, utils_1.getTargets)(this.element);
              firstTarget.focus();
            }
          };
          reInitFocus = () => {
            if (!this.isOpen) return;
            const { firstTarget } = (0, utils_1.getTargets)(this);
            firstTarget?.focus();
          };
        }
        exports.SidebarFiltersDesktop = SidebarFiltersDesktop;
      },
      7607: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SidebarFiltersStickyMobileButton = void 0);
        const debounce_1 = __webpack_require__2(2731),
          sidebar_button_1 = __webpack_require__2(9315),
          utils_1 = __webpack_require__2(4083),
          FOOTER_SELECTOR = ".shopify-section-footer",
          PRODUCTS_SELECTOR = "#ShopProducts",
          THRESHOLD_FOR_EXTEND = 24;
        class SidebarFiltersStickyMobileButton extends sidebar_button_1.SidebarButton {
          prevScrollY;
          mountComponent() {
            super.mountComponent(),
              this.addListener(window, "scroll", this.handleWindowScroll);
          }
          handleWindowScroll = () => {
            this.prevScrollY || (this.prevScrollY = window.scrollY),
              this.updateVisibleStatus(),
              this.updateExtendStatus();
          };
          updateVisibleStatus() {
            const products = (0, utils_1.$el)(PRODUCTS_SELECTOR),
              footer = (0, utils_1.$el)(FOOTER_SELECTOR),
              rect = products?.getBoundingClientRect(),
              footerOffsetTop = footer ? footer.offsetTop : 0,
              isUnderFooter =
                window.innerHeight + window.scrollY < footerOffsetTop,
              isUnderProduct = rect.top < 0,
              isVisible = isUnderFooter && isUnderProduct;
            this.toggleAttribute("is-visible", isVisible),
              document.body.toggleAttribute(
                "is-filters-button-fixed",
                isVisible
              );
          }
          updateExtendStatus = (0, debounce_1.debounce)(() => {
            Math.abs(window.scrollY - this.prevScrollY) >
              THRESHOLD_FOR_EXTEND &&
              this.toggleAttribute(
                "is-extended",
                this.prevScrollY > window.scrollY
              ),
              (this.prevScrollY = 0);
          }, 50);
        }
        exports.SidebarFiltersStickyMobileButton =
          SidebarFiltersStickyMobileButton;
      },
      9246: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SidebarFiltersMobile = void 0);
        const utils_1 = __webpack_require__2(4083),
          dom_1 = __webpack_require__2(3889),
          sidebar_filters_1 = __webpack_require__2(8030),
          FILTER_REMOVE_BUTTON_SELECTOR = "filter-remove-btn",
          SHOP_SELECTOR = "shop-component";
        class SidebarFiltersMobile extends sidebar_filters_1.SidebarFilters {
          change() {
            const shop = (0, utils_1.$el)(SHOP_SELECTOR);
            if (shop) {
              this.createQuery(), shop.updateBySearchParams(this.searchParams);
              const preparedUrl = `${window.location.pathname}?${
                shop.formatParams(this.searchParams) || ""
              }`;
              shop.updateFilters(preparedUrl), this.setButtonForReset();
            }
          }
          setButtonForReset() {
            const button = (0, utils_1.$el)(
              FILTER_REMOVE_BUTTON_SELECTOR,
              this.element
            );
            button &&
              button.classList.contains("hidden") &&
              (0, dom_1.showElement)(button);
          }
        }
        exports.SidebarFiltersMobile = SidebarFiltersMobile;
      },
      8030: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SidebarFilters = void 0);
        const dom_1 = __webpack_require__2(3889),
          sidebar_1 = __webpack_require__2(4622),
          utils_1 = __webpack_require__2(4083),
          key_1 = __webpack_require__2(9650),
          FORM_SELECTOR = "[data-filters-form]",
          CHECKBOX_SELECTOR = "[data-filters-checkbox]",
          SHOP_SELECTOR = "shop-component",
          HEADER_SELECTOR = "[data-filters-header]",
          PRELOADER_SELECTOR = "[data-filters-loading-overlay]";
        class SidebarFilters extends sidebar_1.SidebarComponent {
          mountComponent() {
            super.mountComponent();
            const form = (0, utils_1.$el)(FORM_SELECTOR, this.element);
            this.addListener(form, "scroll", this.handleFormScroll),
              this.addListener(form, "change", this.handleInputChange),
              this.addListener(this, "click", this.handleClick),
              this.addListener(form, "keydown", this.handleFormKeydown),
              (0, utils_1.$el)(SHOP_SELECTOR).on(
                "filtersUpdated",
                this.reInitFocus
              );
          }
          handleFormScroll = () => {
            const form = (0, utils_1.$el)(FORM_SELECTOR, this.element);
            form &&
              this.toggleAttribute("header-shadow-visible", form.scrollTop > 0);
          };
          handleClick = (event) => {
            const label = (0, utils_1.$elParent)(
              CHECKBOX_SELECTOR,
              event.target
            );
            label && label.setAttribute("selected", "");
          };
          handleFormKeydown = (event) => {
            if ((0, key_1.isEnterKey)(event)) {
              event.preventDefault();
              const target = event.target;
              target.tagName === "INPUT" &&
                target.dispatchEvent(
                  new MouseEvent("click", { button: 0, which: 1 })
                );
            }
          };
          handleInputChange = (event) => {
            event.target.tagName === "INPUT" && this.change();
          };
          createQuery() {
            const form = (0, utils_1.$el)(FORM_SELECTOR, this.element),
              shop = (0, utils_1.$el)(SHOP_SELECTOR);
            if (form && shop) {
              const formData = new FormData(form),
                filterQuery = new URLSearchParams(formData).toString();
              shop.filterQuery = filterQuery;
            }
          }
          updateHTML(html) {
            let newElement;
            const filterId = this.getAttribute("id"),
              newFilter = filterId
                ? (0, utils_1.$el)(`#${filterId}`, html)
                : null;
            if (this.hasAttribute("is-open-on-init"))
              newElement = newFilter
                ? (0, utils_1.$el)("[data-sidebar-body]", newFilter)
                : null;
            else {
              const newTemplate = newFilter
                ? (0, utils_1.$el)(
                    `[data-sidebar-template="${this.id}"]`,
                    newFilter
                  )
                : null;
              newTemplate &&
                (newElement = (0, dom_1.getTemplateFirstChild)(newTemplate));
            }
            newElement &&
              (this.updateFormByElement(newElement),
              this.updateHeaderByElement(newElement));
          }
          updateHeaderByElement(newElement) {
            const header = (0, utils_1.$el)(HEADER_SELECTOR, this.element),
              newHeader = (0, utils_1.$el)(HEADER_SELECTOR, newElement);
            (0, dom_1.replaceNodeChildren)(header, newHeader);
          }
          updateFormByElement(newElement) {
            const form = (0, utils_1.$el)(FORM_SELECTOR, this.element),
              newForm = (0, utils_1.$el)(FORM_SELECTOR, newElement);
            (0, dom_1.replaceNodeChildren)(form, newForm);
          }
          reInitFocus = () => {};
          change() {}
          get searchParams() {
            const shop = (0, utils_1.$el)(SHOP_SELECTOR);
            return shop ? [shop.filterQuery, shop.sortQuery].join("&") : "";
          }
          get preloader() {
            return (0, utils_1.$el)(PRELOADER_SELECTOR, this.element);
          }
        }
        exports.SidebarFilters = SidebarFilters;
      },
      8590: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SortList = void 0);
        const base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          debounce_1 = __webpack_require__2(2731),
          utils_1 = __webpack_require__2(4083),
          LABEL_SELECTOR = "[data-sort-list-label]",
          SHOP_SELECTOR = "shop-component",
          SIDEBAR_SELECTOR = "sidebar-component",
          FORM_SELECTOR = "form",
          INPUT_SELECTOR = "input";
        class SortList extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$list)(LABEL_SELECTOR, this).forEach((label) => {
              this.addListener(label, "keydown", this.handleLabelKeyDown);
            }),
              this.addListener(this, "input", this.handleFormInput);
          }
          handleFormInput = (0, debounce_1.debounce)((event) => {
            event.preventDefault();
            const shop = (0, utils_1.$el)(SHOP_SELECTOR),
              sidebar = (0, utils_1.$elParent)(SIDEBAR_SELECTOR, this),
              input = event.target;
            if ((sidebar && sidebar.hide(), shop && input)) {
              const sortQuery = this.getSortQuery(input);
              let searchParams = `${window.location.search
                .replace(shop.sortQuery, "")
                .replace("?", "")}&${sortQuery}`;
              shop.dataset.baseParams &&
                (searchParams = searchParams.replace(
                  shop.dataset.baseParams,
                  ""
                )),
                (shop.sortQuery = sortQuery),
                shop.updateBySearchParams(searchParams);
            }
          }, 250);
          handleLabelKeyDown = (event) => {
            if ((0, key_1.isEnterKey)(event)) {
              event.preventDefault();
              const input = (0, utils_1.$el)(INPUT_SELECTOR, event.target);
              input &&
                input.dispatchEvent(
                  new MouseEvent("click", { button: 0, which: 1 })
                );
            }
          };
          getSortQuery(input) {
            const form = (0, utils_1.$elParent)(FORM_SELECTOR, input);
            return form
              ? new URLSearchParams(new FormData(form)).toString()
              : "";
          }
        }
        exports.SortList = SortList;
      },
      9744: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.AddressesComponent = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          ADDRESS_DELETE_BUTTON_SELECTOR = "[data-addresses-delete-button]",
          postLink = function (path, options) {
            options = options || {};
            const method = options.method || "post",
              params = options.parameters || {},
              form = document.createElement("form");
            form.setAttribute("method", method),
              form.setAttribute("action", path);
            for (let key in params) {
              let hiddenField = document.createElement("input");
              hiddenField.setAttribute("type", "hidden"),
                hiddenField.setAttribute("name", key),
                hiddenField.setAttribute("value", params[key]),
                form.appendChild(hiddenField);
            }
            document.body.appendChild(form),
              form.submit(),
              document.body.removeChild(form);
          };
        class AddressesComponent extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$list)(ADDRESS_DELETE_BUTTON_SELECTOR, this).forEach(
              (element) => {
                this.addListener(
                  element,
                  "click",
                  this.handleDeleteButtonClick
                );
              }
            ),
              this.addListener(this, "keydown", this.handleKeydown);
          }
          handleKeydown = (event) => {
            const target = event.target;
            target.getAttribute("type") === "checkbox" &&
              (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), (target.checked = !target.checked));
          };
          handleDeleteButtonClick = ({ currentTarget }) => {
            const text = currentTarget.getAttribute("data-confirm-message");
            confirm(text) &&
              postLink(currentTarget.dataset.target, {
                parameters: { _method: "delete" },
              });
          };
        }
        exports.AddressesComponent = AddressesComponent;
      },
      6740: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.CountrySelector = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          dom_1 = __webpack_require__2(3889),
          FLOAT_ELEMENT_SELECTOR = "float-element",
          INPUT_SELECTOR = "input",
          DROPDOWN_TOGGLE_LABEL_SELECTOR = ".dropdown__toggle-label",
          DROPDOWN_ITEM_SELECTOR = ".dropdown__item",
          DROPDOWN_SELECTOR = "float-element",
          DROPDOWN_OPTION_SELECTOR = "option";
        class CountrySelector extends base_component_1.BaseComponent {
          mountComponent() {
            this.createItems(),
              this.addListener(this, "click", this.handleItemClick);
          }
          handleItemClick = (event) => {
            const dropdown = (0, utils_1.$el)(FLOAT_ELEMENT_SELECTOR, this),
              input = (0, utils_1.$el)(INPUT_SELECTOR, this),
              dropdownBtnLabel = (0, utils_1.$el)(
                DROPDOWN_TOGGLE_LABEL_SELECTOR,
                this
              ),
              target = event.target;
            (0, utils_1.$elParent)(DROPDOWN_ITEM_SELECTOR, target) &&
              (!input ||
                !dropdownBtnLabel ||
                !dropdown ||
                (input.setAttribute("value", target.dataset.value),
                this.setActiveItem(target.dataset.value),
                (dropdownBtnLabel.innerHTML = target.dataset.value),
                dropdown.hide()));
          };
          setActiveItem(activeCountryValue) {
            (0, utils_1.$list)(DROPDOWN_ITEM_SELECTOR, this).forEach((item) => {
              item.classList.toggle(
                "active",
                item.dataset.value === activeCountryValue
              );
            });
          }
          createItems() {
            const dropdown = (0, utils_1.$el)(DROPDOWN_SELECTOR, this),
              options = (0, utils_1.$list)(DROPDOWN_OPTION_SELECTOR, this),
              fragment = document.createDocumentFragment();
            dropdown &&
              (options.forEach((option) => {
                const item = document.createElement("div"),
                  clonedOption = option.cloneNode(!0);
                item.classList.add("dropdown__item"),
                  item.setAttribute("tabindex", "0"),
                  (item.dataset.value = option.value),
                  (item.dataset.provinces = option.dataset.provinces),
                  item.replaceChildren(...clonedOption.childNodes),
                  fragment.appendChild(item);
              }),
              (0, dom_1.replaceNodeChildren)(dropdown.element, fragment));
          }
        }
        exports.CountrySelector = CountrySelector;
      },
      4570: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.AddressesComponent =
            exports.CountrySelector =
            exports.LoginComponent =
            exports.RegisterComponent =
              void 0);
        var register_component_1 = __webpack_require__2(6698);
        Object.defineProperty(exports, "RegisterComponent", {
          enumerable: !0,
          get: function () {
            return register_component_1.RegisterComponent;
          },
        });
        var login_component_1 = __webpack_require__2(8810);
        Object.defineProperty(exports, "LoginComponent", {
          enumerable: !0,
          get: function () {
            return login_component_1.LoginComponent;
          },
        });
        var country_selector_1 = __webpack_require__2(6740);
        Object.defineProperty(exports, "CountrySelector", {
          enumerable: !0,
          get: function () {
            return country_selector_1.CountrySelector;
          },
        });
        var addresses_1 = __webpack_require__2(9744);
        Object.defineProperty(exports, "AddressesComponent", {
          enumerable: !0,
          get: function () {
            return addresses_1.AddressesComponent;
          },
        });
      },
      8810: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.LoginComponent = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          LOGIN_FORM_SELECTOR = "[data-login-form]";
        class LoginComponent extends base_component_1.BaseComponent {
          mountComponent() {
            this.updateFocus(),
              this.addListener(this, "click", this.handleClick);
          }
          handleClick = (event) => {
            const target = event.target;
            if (target.hasAttribute("data-login-form-button")) {
              const loginFormId = target.dataset.loginFormId || "";
              this.setFormVisibleById(loginFormId), this.updateFocus();
            }
          };
          setFormVisibleById(loginFormId) {
            (0, utils_1.$list)(LOGIN_FORM_SELECTOR, this).forEach((form) => {
              const isTargetForm =
                form.getAttribute("data-login-form") === loginFormId;
              form.classList.toggle("hidden", !isTargetForm);
            });
          }
          updateFocus() {
            (0, utils_1.$list)(LOGIN_FORM_SELECTOR, this).forEach((form) => {
              const isHidden = form.classList.contains("hidden"),
                emailInput = (0, utils_1.$el)('[type="email"]', form);
              !isHidden && emailInput && emailInput.focus();
            });
          }
        }
        exports.LoginComponent = LoginComponent;
      },
      6698: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.RegisterComponent = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          FORM_SELECTOR = "[data-register-form]";
        class RegisterComponent extends base_component_1.BaseComponent {
          mountComponent() {
            const form = (0, utils_1.$el)(FORM_SELECTOR, this);
            this.addListener(form, "submit", this.handleSubmit);
          }
          handleSubmit() {
            localStorage.setItem("isRegistered", "true");
          }
        }
        exports.RegisterComponent = RegisterComponent;
      },
      5959: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.FaqSection = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          ACCORDEON_SELECTOR = "accordeon-component";
        class FaqSection extends base_component_1.BaseComponent {
          mountComponent() {
            (0, utils_1.$list)(ACCORDEON_SELECTOR, this).forEach((tab) => {
              (0, utils_1.whenDefined)(ACCORDEON_SELECTOR).then(() => {
                tab.on("toggle", this.handleTabToggle);
              });
            });
          }
          unmountComponent() {
            (0, utils_1.$list)(ACCORDEON_SELECTOR, this).forEach((tab) => {
              (0, utils_1.whenDefined)(ACCORDEON_SELECTOR).then(() => {
                tab.off("toggle", this.handleTabToggle);
              });
            });
          }
          handleTabToggle = ({ blockId }) => {
            (0, utils_1.$list)(ACCORDEON_SELECTOR, this).forEach((tab) => {
              tab.dataset.blockId !== blockId && tab.isExpanded && tab.hide();
            });
          };
        }
        exports.FaqSection = FaqSection;
      },
      8563: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.FaqSection = void 0);
        var faq_1 = __webpack_require__2(5959);
        Object.defineProperty(exports, "FaqSection", {
          enumerable: !0,
          get: function () {
            return faq_1.FaqSection;
          },
        });
      },
      8432: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.FeaturedNavigation = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          check_media_1 = __webpack_require__2(5580),
          debounce_1 = __webpack_require__2(2731);
        class FeaturedNavigation extends base_component_1.BaseComponent {
          elementsTemplateAttribute;
          lineAttribute;
          imageAttribute;
          buttonAttribute;
          imageActiveClass;
          buttonActiveClass;
          buttonIconAttribute;
          template;
          floatingImg;
          floatingBtn;
          container;
          lines;
          images;
          buttons;
          iconPlaceholder;
          scrollingType;
          scrollingTypeAttribute;
          imageWidth;
          imageHeight;
          buttonWidth;
          buttonHeight;
          isAnimating;
          forceStopped;
          mouseIsOn;
          isMobile;
          resizeObserver;
          activeImage;
          activeButton;
          animation;
          x;
          y;
          mouseY;
          constructor() {
            super(),
              (this.elementsTemplateAttribute = "[data-elements-template]"),
              (this.lineAttribute = "[data-navigation-line]"),
              (this.imageAttribute = "[data-navigation-line-image]"),
              (this.buttonAttribute = "[data-navigation-line-button]"),
              (this.imageActiveClass =
                "featured-navigation__link-image--active"),
              (this.buttonActiveClass = "featured-navigation__btn--active"),
              (this.buttonIconAttribute = "[data-button-without-text]"),
              (this.scrollingTypeAttribute = "data-scrolling-type"),
              (this.template = this.querySelector(
                this.elementsTemplateAttribute
              )),
              (this.floatingImg = this.template.content.querySelector(
                this.imageAttribute
              )),
              (this.floatingBtn = this.template.content.querySelector(
                this.buttonAttribute
              )),
              (this.container = this.querySelector(".container")),
              (this.lines = this.querySelectorAll(this.lineAttribute)),
              (this.images = (0, utils_1.$list)(this.imageAttribute, this)),
              (this.buttons = (0, utils_1.$list)(this.buttonAttribute, this)),
              (this.iconPlaceholder = (0, utils_1.$el)(
                this.buttonIconAttribute,
                this
              )?.firstElementChild?.cloneNode(!0)),
              (this.scrollingType = this.getAttribute(
                this.scrollingTypeAttribute
              )),
              (this.isAnimating = !1),
              (this.forceStopped = !0),
              (this.isMobile = (0, check_media_1.isMobile)()),
              (this.resizeObserver = new ResizeObserver(this.handleResize)),
              this.resizeObserver.observe(this);
          }
          connectedCallback() {
            this.isMobile || this.initDesktop();
          }
          disconnectedCallback() {
            this.deInitDesktop();
          }
          initDesktop = () => {
            this.initFloatingElements(),
              this.setRects(this.floatingImg, this.buttons[0]),
              this.addEventListener("mouseenter", this.handleMouseEnter),
              this.lines.forEach((line) => {
                this.scrollingType === "none"
                  ? (line
                      .querySelector(".featured-navigation__link-text")
                      .addEventListener(
                        "mouseenter",
                        this.handleMouseEnterLine
                      ),
                    line
                      .querySelector(".featured-navigation__link-text")
                      .addEventListener(
                        "mouseleave",
                        this.handleMouseLeaveLine
                      ))
                  : line.addEventListener(
                      "mouseenter",
                      this.handleMouseEnterLine
                    );
              });
          };
          deInitDesktop = () => {
            this.deinitFloatingElements(),
              this.removeEventListener("mouseenter", this.handleMouseEnter),
              this.lines.forEach((line) => {
                this.scrollingType === "none"
                  ? (line
                      .querySelector(".featured-navigation__link-text")
                      .removeEventListener(
                        "mouseenter",
                        this.handleMouseEnterLine
                      ),
                    line
                      .querySelector(".featured-navigation__link-text")
                      .removeEventListener(
                        "mouseleave",
                        this.handleMouseLeaveLine
                      ))
                  : line.removeEventListener(
                      "mouseenter",
                      this.handleMouseEnterLine
                    );
              }),
              document.removeEventListener("mousemove", this.handleMouseMove);
          };
          initFloatingElements = () => {
            (this.activeImage = this.floatingImg.cloneNode(!0)),
              (this.activeButton = this.floatingBtn.cloneNode(!0)),
              this.container.appendChild(this.activeImage),
              this.container.appendChild(this.activeButton),
              this.scaleDown();
          };
          deinitFloatingElements = () => {
            this.activeImage.remove(), this.activeButton.remove();
          };
          handleMouseEnterLine = (event) => {
            const { targetImage, targetButton } =
              this.getTargetImageAndButton(event);
            this.replaceFloatingElementsData(targetImage, targetButton),
              (this.forceStopped = !1),
              this.isAnimating || this.handleMouseEnter(event);
          };
          handleMouseLeaveLine = () => {
            this.scaleDown();
          };
          replaceFloatingElementsData = (imageData, buttonData) => {
            imageData
              ? ((this.activeImage.src = imageData?.src),
                (this.activeImage.srcset = imageData?.srcset),
                (this.activeImage.style.maxHeight = `${
                  imageData.getBoundingClientRect().height
                }px`),
                this.toggleImageActiveClass(this.activeImage, "add"),
                (this.activeImage.style.opacity = "1"))
              : (this.toggleImageActiveClass(this.activeImage, "add"),
                (this.activeImage.style.opacity = "0")),
              buttonData
                ? (buttonData.hasAttribute("data-button-without-text")
                    ? this.activeButton.replaceChildren(this.iconPlaceholder)
                    : (this.activeButton.textContent = buttonData.textContent),
                  (this.activeButton.className = `${buttonData.className} ${this.buttonActiveClass}`),
                  (this.activeButton.href = buttonData.href),
                  this.toggleButtonActiveClass(this.activeButton, "add"),
                  (this.activeButton.style.opacity = "1"))
                : (this.activeButton.style.opacity = "0"),
              this.scaleUp(),
              this.setRects(imageData, buttonData);
          };
          handleMouseEnter = (event) => {
            (this.activeImage.style.translate = `${
              event.clientX - this.imageWidth
            }px ${event.clientY - this.imageHeight}px`),
              (this.activeButton.style.translate = `${
                event.clientX - this.buttonWidth
              }px ${event.clientY - this.buttonHeight}px`),
              this.mouseIsOn ||
                (document.addEventListener("mousemove", this.handleMouseMove),
                this.toggleScrollListener(!0)),
              (this.mouseIsOn = !0);
          };
          handleMouseLeave = () => {
            this.scaleDown(), this.toggleScrollListener(!1);
          };
          toggleScrollListener = (add) => {
            add
              ? this.addListener(window, "scroll", this.handleScroll)
              : this.removeListener(window, "scroll", this.handleScroll);
          };
          handleScroll = (0, debounce_1.debounce)(() => {
            const { top, bottom } = this.getBoundingClientRect();
            (this.mouseY < top || this.mouseY > bottom) &&
              this.handleMouseLeave();
          }, 100);
          handleMouseMove = (event) => {
            if (!this.forceStopped) {
              const target = event.target;
              (target === this.container ||
                !target.closest("featured-navigation")) &&
                this.handleMouseLeave();
              const { x, y, mouseY } = this.getMouseCoordinates(
                event.clientX,
                event.clientY
              );
              (this.x = x),
                (this.y = y),
                (this.mouseY = mouseY),
                this.isAnimating || this.startAnimation();
            }
          };
          startAnimation = () => {
            (this.isAnimating = !0),
              (this.animation = requestAnimationFrame(this.tick));
          };
          stopAnimation = () => {
            (this.isAnimating = !1),
              cancelAnimationFrame(this.animation),
              this.activeImage.style.scale === "0" &&
                this.activeButton.style.scale === "0" &&
                ((this.forceStopped = !0),
                this.toggleImageActiveClass(this.activeImage, "remove"),
                this.toggleButtonActiveClass(this.activeButton, "remove"),
                document.removeEventListener("mousemove", this.handleMouseMove),
                (this.mouseIsOn = !1));
          };
          tick = (time) => {
            const { x, y, width } = this.activeImage
                ? this.activeImage.getBoundingClientRect()
                : this.activeButton.getBoundingClientRect(),
              targetXimage = +(this.x - x).toFixed(3),
              targetYimage = +(this.y - y).toFixed(3),
              targetXbutton = targetXimage + this.imageWidth - this.buttonWidth,
              targetYbutton =
                targetYimage + this.imageHeight - this.buttonHeight;
            this.draw(
              targetXimage + x,
              targetYimage + y,
              targetXbutton + x,
              targetYbutton + y
            ),
              targetXimage !== 0 && targetYimage !== 0 && width > 0
                ? (this.animation = requestAnimationFrame(this.tick))
                : this.stopAnimation();
          };
          draw = (imageX, imageY, buttonX, buttonY) => {
            (this.activeImage.style.translate = `${imageX}px ${imageY}px`),
              (this.activeButton.style.translate = `${buttonX}px ${buttonY}px`);
          };
          getTargetImageAndButton = (event) => {
            const targetLine = event.currentTarget,
              id =
                targetLine.dataset.navigationLine || targetLine.dataset.lineId,
              targetImage = this.images.find(
                (img) => img.dataset.navigationLineImage === id
              ),
              targetButton = this.buttons.find(
                (btn) => btn.dataset.navigationLineButton === id
              );
            return { targetImage, targetButton };
          };
          setRects = (targetImage, targetButton) => {
            (this.imageWidth = this.activeImage.offsetWidth / 2),
              (this.imageHeight = targetImage
                ? targetImage.scrollHeight / 2
                : this.activeImage.offsetHeight / 2),
              (this.buttonWidth = targetButton?.offsetWidth / 2),
              (this.buttonHeight = targetButton?.offsetHeight / 2);
          };
          getMouseCoordinates = (x, y) => ({
            x: x - this.imageWidth,
            y: y - this.imageHeight,
            mouseY: y,
          });
          toggleButtonActiveClass = (element, action) => {
            element?.classList.toggle(this.buttonActiveClass, action === "add");
          };
          toggleImageActiveClass = (element, action) => {
            element?.classList.toggle(this.imageActiveClass, action === "add");
          };
          scaleUp = () => {
            (this.activeImage.style.scale = "1"),
              (this.activeButton.style.scale = "1");
          };
          scaleDown = () => {
            (this.activeImage.style.scale = "0"),
              (this.activeButton.style.scale = "0");
          };
          handleResize = (0, debounce_1.debounce)(() => {
            (0, check_media_1.isMobile)() !== this.isMobile &&
              ((0, check_media_1.isMobile)()
                ? this.deInitDesktop()
                : this.initDesktop(),
              (this.isMobile = (0, check_media_1.isMobile)()));
          }, 200);
        }
        exports.FeaturedNavigation = FeaturedNavigation;
      },
      6979: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.DrawerMenuPageLink = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          key_1 = __webpack_require__2(9650),
          DRAWER_MENU_SELECTOR = "drawer-menu";
        class DrawerMenuPageLink extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "click", this.handlePageLinkClick),
              this.addListener(this, "keyup", this.handleKeyDown);
          }
          handlePageLinkClick = (event) => {
            event.preventDefault(), this.setPage();
          };
          handleKeyDown = (event) => {
            (0, key_1.isEnterKey)(event) &&
              (event.preventDefault(), this.setPage());
          };
          setPage() {
            const drawerMenu = (0, utils_1.$elParent)(
              DRAWER_MENU_SELECTOR,
              this
            );
            drawerMenu &&
              drawerMenu.setPage(drawerMenu.pageMap[this.dataset.pageId]);
          }
        }
        exports.DrawerMenuPageLink = DrawerMenuPageLink;
      },
      910: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.DrawerMenuPage = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          BLOCK_SELECTOR = "[data-drawer-menu-content]";
        class DrawerMenuPage extends base_component_1.BaseComponent {
          mountComponent() {
            const block = (0, utils_1.$el)(BLOCK_SELECTOR, this);
            this.addListener(block, "scroll", this.handleBlockScroll);
          }
          handleBlockScroll = () => {
            const block = (0, utils_1.$el)(BLOCK_SELECTOR, this);
            block &&
              this.toggleAttribute(
                "header-shadow-visible",
                block.scrollTop > 0
              );
          };
        }
        exports.DrawerMenuPage = DrawerMenuPage;
      },
      1035: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.DrawerMenu = void 0);
        const check_media_1 = __webpack_require__2(5580),
          sidebar_1 = __webpack_require__2(4622),
          utils_1 = __webpack_require__2(4083),
          HEADER_COMPONENT_SELECTOR = "header-component",
          DRAWER_MENU_PAGE_SELECTOR = "drawer-menu-page",
          TOGGLER_SELECTOR = "#DrawerMenuToggler";
        class DrawerMenu extends sidebar_1.SidebarComponent {
          openedPage;
          pageMap;
          isCurrentModeMobile;
          resizeObserver;
          constructor() {
            super(), (this.pageMap = this.generatePageMap());
          }
          mountComponent() {
            super.mountComponent();
            const header = (0, utils_1.$el)(HEADER_COMPONENT_SELECTOR);
            (0, utils_1.whenDefined)(HEADER_COMPONENT_SELECTOR).then(() => {
              header.on("drawerActivated", this.handleSetAsSection),
                header.on("drawerUnActivated", this.handleUnsetAsSection);
            }),
              this.isEditor &&
                (this.editor.on("BLOCK_SELECT", this.handleBlockSelect),
                this.editor.on("BLOCK_DESELECT", this.handleBlockDeselect),
                this.editor.on("SECTION_SELECT", this.handleSectionSelect),
                this.editor.on("SECTION_DESELECT", this.handleSectionDeselect));
          }
          unmountComponent() {
            super.unmountComponent();
            const header = (0, utils_1.$el)(HEADER_COMPONENT_SELECTOR);
            this.isEditor &&
              (this.editor.off("BLOCK_SELECT", this.handleBlockSelect),
              this.editor.off("BLOCK_DESELECT", this.handleBlockDeselect),
              this.editor.off("SECTION_SELECT", this.handleSectionSelect),
              this.editor.off("SECTION_DESELECT", this.handleSectionDeselect),
              header.off("headerNavFitted", this.handleSetAsSection)),
              header.off("headerNavUnfitted", this.handleUnsetAsSection);
          }
          handleSetAsSection = () => {
            this.setAttribute("data-drawer-menu-is-section", "");
          };
          handleUnsetAsSection = () => {
            this.removeAttribute("data-drawer-menu-is-section"),
              this.isOpen && this.hide();
          };
          handleResize = () => {
            this.isCurrentModeMobile !== (0, check_media_1.isMobile)() &&
              this.isOpen &&
              this.hide(!0);
          };
          handleSectionSelect = ({ detail: { sectionId } }) => {
            this.isVisible &&
              this.dataset.sectionId === sectionId &&
              (this.open(), this.reset());
          };
          handleSectionDeselect = ({ detail: { sectionId } }) => {
            this.isVisible &&
              this.dataset.sectionId === sectionId &&
              (this.reset(), this.hide(!0));
          };
          handleBlockSelect = ({ detail: { blockId, sectionId } }) => {
            if (this.isVisible && this.dataset.sectionId === sectionId) {
              const target = (0, utils_1.$list)(
                DRAWER_MENU_PAGE_SELECTOR,
                this.element
              ).find((page) => page.querySelector(`[block-id='${blockId}']`));
              if (!target) return;
              this.open(), this.setPage(target);
            }
          };
          handleBlockDeselect = ({ detail: { blockId, sectionId } }) => {
            if (this.isVisible && this.dataset.sectionId === sectionId) {
              if (
                !(0, utils_1.$list)(
                  DRAWER_MENU_PAGE_SELECTOR,
                  this.element
                ).find((page) => page.querySelector(`[block-id='${blockId}']`))
              )
                return;
              this.hide(!0);
            }
          };
          handlePageKeydown = (event) => {
            event.preventDefault();
            const target = event.target,
              page = (0, utils_1.$elParent)(DRAWER_MENU_PAGE_SELECTOR, target);
            if (!page) return;
            const targets = (0, utils_1.$list)(
                (0, utils_1.getFocusTargets)(),
                page
              ),
              isLast = target === targets[targets.length - 1],
              isFirst = target === targets[0],
              isShift = event.shiftKey;
            ((isShift && isFirst) || (!isShift && isLast)) &&
              this.focusOnToggler();
          };
          mount() {
            super.mount(),
              this.addListener(this, "keydown", this.handlePageKeydown),
              (this.isCurrentModeMobile = (0, check_media_1.isMobile)()),
              (this.resizeObserver = new ResizeObserver(this.handleResize)),
              this.resizeObserver.observe(this);
          }
          unmount() {
            this.removeListener(this, "keydown", this.handlePageKeydown),
              this.resizeObserver?.disconnect(),
              super.unmount();
          }
          focusOnToggler() {
            this.hide().then(() => {
              (0, utils_1.$el)(TOGGLER_SELECTOR)?.focus();
            });
          }
          generatePageMap() {
            return (0, utils_1.$list)(
              DRAWER_MENU_PAGE_SELECTOR,
              this.element
            ).reduce((map, page) => {
              const pageId = page.dataset.pageId;
              return pageId ? { ...map, [pageId]: page } : map;
            }, {});
          }
          setPage(page) {
            const pageId = page.dataset.pageId,
              prevOpenedPageId = this.openedPage?.dataset.prevPageId,
              isReturn = pageId === prevOpenedPageId;
            this.openedPage &&
              isReturn &&
              this.setPageVisible(this.openedPage, !1);
            const firstFocusTarget = (0, utils_1.$el)(
              (0, utils_1.getFocusTargets)(),
              page
            );
            firstFocusTarget && firstFocusTarget.focus(),
              this.setPageVisible(page, !0),
              (this.openedPage = page);
          }
          reset() {
            const pages = (0, utils_1.$list)(
                DRAWER_MENU_PAGE_SELECTOR,
                this.element
              ),
              homePage = this.pageMap.Menu;
            pages.forEach((page) => {
              this.setPageVisible(page, !1);
            }),
              this.setPageVisible(homePage, !0),
              (this.openedPage = homePage);
          }
          setPageVisible(page, isVisible) {
            page.setAttribute("aria-hidden", isVisible ? "false" : "true");
          }
          async open() {
            (0, utils_1.$el)(HEADER_COMPONENT_SELECTOR)?.updatePosition(),
              super.open();
          }
          async hide(isInstant) {
            this.reset(), super.hide(isInstant);
          }
          get isVisible() {
            const isLowResolution = matchMedia("(max-width: 992px)").matches;
            return (
              this.hasAttribute("data-drawer-menu-is-section") ||
              isLowResolution
            );
          }
        }
        exports.DrawerMenu = DrawerMenu;
      },
      6409: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.HeaderComponent = void 0);
        const base_component_1 = __webpack_require__2(3608),
          check_media_1 = __webpack_require__2(5580),
          debounce_1 = __webpack_require__2(2731),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          HEADER_NAV_SELECTOR = "[data-desktop-nav]",
          BURGER_ICON_SELECTOR = ".drawer-menu-toggle",
          HEADER_GRID_SELECTOR = ".header__grid",
          HEADER_DROPDOWN_BACKDROP_SELECTOR = "[data-header-dropdown-backdrop]",
          HEADER_DROPDOWN_WITH_BACKDROP_BTN_SELECTOR =
            "data-header-btn-with-backdrop",
          SECTION_SELECTOR = ".shopify-section-header",
          BODY_ELEMENT_SELECTOR = "body-element";
        class HeaderComponent extends base_component_1.BaseComponent {
          headerGrid;
          navContainer;
          burgerIcon;
          navFirstItem;
          navLastItem;
          dropdownsBackdrop;
          headerLinks;
          dropdowns;
          openers;
          openedElementId;
          lastScrollPosition = 0;
          headerSectionBottom;
          resizeObserver;
          isHidden;
          lastBottom;
          lastHeight;
          navWidth;
          isSticky;
          isCurrentSticky;
          isDynamicSticky;
          isDynamicShowLocked;
          stickyVariant;
          isTransparent;
          blockInEditorSelected;
          mountComponent() {
            if (
              ((this.isSticky = this.hasAttribute("is-sticky")),
              (this.isTransparent = this.hasAttribute("is-transparent")),
              this.isTransparent && this.setTransparentHeader(),
              this.updatePosition(),
              this.addListener(window, "scroll", this.handleScroll),
              this.moveDrawer(),
              (this.navContainer = (0, utils_1.$el)(HEADER_NAV_SELECTOR, this)),
              this.navContainer)
            )
              if (
                (this.setNavItems(),
                this.checkIsNavContainerFitAllLinks(),
                (this.dropdownsBackdrop = (0, utils_1.$el)(
                  HEADER_DROPDOWN_BACKDROP_SELECTOR,
                  this
                )),
                this.hasAttribute("with-open-on-click"))
              )
                (this.openers = (0, utils_1.$list)(
                  "dropdown-opener[data-header-btn-with-backdrop]"
                )),
                  customElements.whenDefined("dropdown-opener").then(() => {
                    this.openers.forEach((opener) => {
                      opener.on("openerClick", this.handleOpenerClick),
                        opener.on(
                          "openerClickOutside",
                          this.handleOpenerClickOutside
                        );
                    });
                  });
              else {
                const btns = (0, utils_1.$list)(
                  "[data-header-btn-with-backdrop]"
                );
                customElements
                  .whenDefined("header-float-element-btn")
                  .then(() => {
                    btns.forEach((btn) => {
                      this.addListener(
                        btn,
                        "mouseenter",
                        this.handleBtnMouseEnter
                      );
                    });
                  });
              }
            (this.resizeObserver = new ResizeObserver(this.handleResize)),
              this.resizeObserver.observe(this),
              this.isEditor &&
                ((this.blockInEditorSelected = !1),
                this.editor.on("SECTION_LOAD", this.handleSectionLoad),
                this.editor.on("SECTION_UNLOAD", this.handleSectionLoad));
          }
          unmountComponent() {
            this.resizeObserver.disconnect();
          }
          handleBtnMouseEnter = ({ currentTarget }) => {
            this.handleButtonHover(currentTarget),
              this.addListener(document, "mousemove", this.handleMouseMove);
          };
          handleOpenerClick = ({ element, opener }) => {
            this.openers.forEach((el) => {
              el.setExpand(el === opener);
            }),
              this.openedElementId === element.floatElementId
                ? (this.handleMouseLeave(), opener.setExpand(!1))
                : this.handleButtonHover(element);
          };
          handleOpenerClickOutside = ({ element, opener }) => {
            this.handleMouseLeave(), opener.setExpand(!1);
          };
          handleMouseMove = (0, debounce_1.debounce)(({ target }) => {
            const isButton = target.closest(
                `[${HEADER_DROPDOWN_WITH_BACKDROP_BTN_SELECTOR}]`
              ),
              isInside =
                target.closest(".header__dropdown-menu") ||
                target.closest("#Portal");
            !isButton && !isInside && this.handleMouseLeave();
          }, 20);
          handleButtonHover = (button) => {
            this.emit("headerButtonHover", {
              floatElementId: button.floatElementId,
            });
            const height = this.getFloatElementHeight(button.floatElement);
            this.expandDropdownBackdrop(height),
              (this.openedElementId = button.floatElementId);
          };
          getFloatElementHeight = (floatElement) =>
            floatElement.maxHeight || floatElement.currentVisible.offsetHeight;
          handleMouseLeave = () => {
            (this.openedElementId = null),
              !(this.isEditor && this.blockInEditorSelected) &&
                (this.collapseDropdownBackdrop(),
                this.emit("mouseLeavedHeader", {}),
                this.removeListener(
                  document,
                  "mousemove",
                  this.handleMouseMove
                ));
          };
          expandDropdownBackdrop = (height) => {
            this.dropdownsBackdrop.setAttribute(
              "style",
              `--gsc-header-backdrop-height: ${height}px;`
            ),
              (0, utils_1.transitionToPromise)(this.dropdownsBackdrop).then(
                () => {
                  this.dropdownsBackdrop.setAttribute(
                    "with-opened-dropdown",
                    ""
                  );
                }
              );
          };
          collapseDropdownBackdrop = () => {
            this.dropdownsBackdrop.setAttribute(
              "style",
              "--gsc-header-backdrop-height: 0px;"
            ),
              this.dropdownsBackdrop.removeAttribute("with-opened-dropdown"),
              this.removeListener(
                this.navContainer,
                "mousemove",
                this.handleMouseMove
              );
          };
          setNavItems = () => {
            this.headerGrid = (0, utils_1.$el)(HEADER_GRID_SELECTOR, this);
            const navItems = (0, utils_1.$list)(
              ".header__item",
              this.navContainer
            );
            (this.navFirstItem = navItems[0]),
              (this.navLastItem = navItems[navItems.length - 1]),
              (this.burgerIcon = (0, utils_1.$el)(
                BURGER_ICON_SELECTOR,
                this
              ).cloneNode(!0)),
              this.burgerIcon.setAttribute("mock", "");
            const navFirstItemLeft =
                this.navFirstItem.getBoundingClientRect().left,
              navLastItemRight = this.navLastItem.getBoundingClientRect().right;
            this.navWidth = navLastItemRight - navFirstItemLeft + 40;
          };
          checkIsNavContainerFitAllLinks = () => {
            if (!this.navContainer) return;
            const navFirstItemLeft =
                this.navFirstItem.getBoundingClientRect().left,
              navLastItemRight = this.navLastItem.getBoundingClientRect().right;
            let prevElement = this.navContainer.previousElementSibling,
              nextElement = this.navContainer.nextElementSibling,
              prevElementRight = prevElement?.getBoundingClientRect().right,
              nextElementleft = nextElement?.getBoundingClientRect().left,
              burgerIconWidth = this.burgerIcon.getBoundingClientRect().width;
            this.headerGrid.className.includes("header__grid--3") &&
              ((prevElementRight = navFirstItemLeft),
              (nextElementleft = prevElement?.getBoundingClientRect().left)),
              (this.headerGrid.className.includes("header__grid--4") ||
                this.headerGrid.className.includes("header__grid--5")) &&
                ((prevElementRight = navFirstItemLeft),
                (nextElementleft = this.getBoundingClientRect().right),
                (burgerIconWidth = 0));
            const isToAddBurger =
              nextElementleft - prevElementRight + burgerIconWidth <=
              this.navWidth;
            this.navContainer.toggleAttribute("hidden", isToAddBurger),
              this.headerGrid.toggleAttribute("fit-nav", isToAddBurger),
              isToAddBurger
                ? (this.headerGrid.prepend(this.burgerIcon),
                  this.emit("drawerActivated", {}))
                : (this.burgerIcon.firstElementChild.classList.remove(
                    "is-opened"
                  ),
                  this.burgerIcon.remove(),
                  this.emit("drawerUnActivated", {}));
          };
          moveDrawer = () => {
            const drawer = (0, utils_1.$el)("drawer-menu", this.section);
            if (drawer) {
              if (this.isEditor) {
                const nextSibling = this.section.nextElementSibling;
                nextSibling.tagName === "DRAWER-MENU" && nextSibling.remove();
              }
              this.section.after(drawer);
            }
          };
          handleResize = (0, debounce_1.debounce)(() => {
            this.isTransparent && this.setTransparentHeader(),
              this.section.classList.remove("scrolled"),
              this.setHidden(!1),
              this.updatePosition();
            const rect = this.section.getBoundingClientRect();
            (this.headerSectionBottom = rect.top + window.scrollY),
              !(0, check_media_1.isMobile)() &&
                this.navContainer &&
                this.checkIsNavContainerFitAllLinks(),
              (this.isCurrentSticky =
                this.isSticky ||
                (!this.isSticky && (0, check_media_1.isMobile)())),
              this.isCurrentSticky ? this.setSticky() : this.removeSticky(),
              this.section.setAttribute("visible", "");
          }, 100);
          handleScroll = (0, debounce_1.debounce)(() => {
            this.isCurrentSticky && this.updateVisibleAfterScroll(),
              this.setScrollStatus();
          }, 20);
          setScrollStatus() {
            if (!this.section) return;
            const savedScrollPosition = Math.abs(
                parseInt(document.body.style.top || "0")
              ),
              scrollPosition = window.scrollY || savedScrollPosition,
              scrolled = this.isDynamicSticky
                ? scrollPosition - 30 > this.lastBottom
                : scrollPosition > this.headerSectionBottom;
            this.section.classList.toggle("scrolled", scrolled);
          }
          updateVisibleAfterScroll() {
            const bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR);
            if (!this.section || bodyElement.isFixed) return;
            const scrollY = window.scrollY,
              threshold = 36,
              scrollDistance = scrollY - this.lastScrollPosition,
              isScrollUp = scrollDistance < 0,
              isScrollDown = scrollDistance > 0,
              isUnderHeader = scrollY > this.headerSectionBottom,
              showOnScrollUp =
                isScrollUp &&
                this.isHidden &&
                scrollDistance + threshold < 0 &&
                isUnderHeader,
              hideOnScrollDown =
                isScrollDown && scrollDistance > threshold && isUnderHeader;
            showOnScrollUp
              ? this.setHidden(!1)
              : hideOnScrollDown && this.setHidden(!0),
              (this.lastScrollPosition = scrollY);
          }
          setHidden(isHidden) {
            !this.section ||
              this.isDynamicShowLocked ||
              ((this.isHidden = isHidden),
              this.section.setAttribute(
                "aria-hidden",
                isHidden ? "true" : "false"
              ));
          }
          setSticky() {
            (this.stickyVariant = this.getAttribute("is-sticky")),
              this.stickyVariant == "static" &&
                document.body.setAttribute("header-desktop-sticky", ""),
              (this.stickyVariant == "dynamic" ||
                (!this.isSticky && (0, check_media_1.isMobile)())) &&
                (this.section.setAttribute("dynamic-sticky", ""),
                (this.isDynamicSticky = !0),
                this.toggleLockDynamicShow(!1)),
              !this.isSticky &&
                (0, check_media_1.isMobile)() &&
                !this.hasAttribute("with-sticky-colored") &&
                this.section.setAttribute("with-sticky-colored", "");
          }
          toggleLockDynamicShow = (bool) => {
            this.setHidden(!0), (this.isDynamicShowLocked = bool);
          };
          removeSticky() {
            this.section.removeAttribute("dynamic-sticky"),
              document.body.removeAttribute("header-desktop-sticky"),
              (this.isDynamicSticky = !1),
              this.hasAttribute("with-sticky-colored") ||
                this.section.removeAttribute("with-sticky-colored");
          }
          updatePosition() {
            if (!this.section) return;
            const rect = this.getBoundingClientRect();
            if (
              (this.lastHeight !== rect.height &&
                ((0, dom_1.setStyleVariable)(
                  "header-height",
                  `${rect.height}px`
                ),
                (this.lastHeight = rect.height)),
              this.lastBottom !== rect.bottom)
            ) {
              const bottomSide = rect.bottom;
              (0, dom_1.setStyleVariable)(
                "header-bottom-side",
                `${bottomSide}px`
              ),
                (this.lastBottom = bottomSide);
            }
          }
          setTransparentHeader = () => {
            this.section.hasAttribute("transparent-setted") ||
              (this.setTransparentMargin(),
              this.section.setAttribute("transparent-setted", ""),
              this.hasAttribute("with-sticky-colored") &&
                this.section.setAttribute("with-sticky-colored", ""));
          };
          setTransparentMargin = () => {
            const { height: headerHeight, bottom: headerBottom } =
              this.getBoundingClientRect();
            (0, utils_1.$el)(
              ".place-under-transparent-header"
            )?.getBoundingClientRect().top -
              headerBottom <
            100
              ? ((this.section.style.marginBottom = `-${headerHeight}px`),
                this.section.classList.add("header--add-mobile-paddings"))
              : this.section.removeAttribute("style");
          };
          handleSectionLoad = (0, debounce_1.debounce)(() => {
            this.isTransparent && this.setTransparentMargin();
          }, 100);
          get section() {
            return (0, utils_1.$el)(SECTION_SELECTOR);
          }
        }
        exports.HeaderComponent = HeaderComponent;
      },
      9300: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.HeaderComponent =
            exports.DrawerMenuPageLink =
            exports.DrawerMenuPage =
            exports.DrawerMenu =
              void 0);
        var drawer_menu_1 = __webpack_require__2(1035);
        Object.defineProperty(exports, "DrawerMenu", {
          enumerable: !0,
          get: function () {
            return drawer_menu_1.DrawerMenu;
          },
        });
        var drawer_menu_page_1 = __webpack_require__2(910);
        Object.defineProperty(exports, "DrawerMenuPage", {
          enumerable: !0,
          get: function () {
            return drawer_menu_page_1.DrawerMenuPage;
          },
        });
        var drawer_menu_page_link_1 = __webpack_require__2(6979);
        Object.defineProperty(exports, "DrawerMenuPageLink", {
          enumerable: !0,
          get: function () {
            return drawer_menu_page_link_1.DrawerMenuPageLink;
          },
        });
        var header_1 = __webpack_require__2(6409);
        Object.defineProperty(exports, "HeaderComponent", {
          enumerable: !0,
          get: function () {
            return header_1.HeaderComponent;
          },
        });
      },
      7041: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.HotspotsFloatElement = void 0);
        const float_element_1 = __webpack_require__2(9448);
        class HotspotsFloatElement extends float_element_1.FloatElement {
          mountComponent() {
            super.mountComponent(), this.mount();
          }
          unmount() {}
        }
        exports.HotspotsFloatElement = HotspotsFloatElement;
      },
      4717: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.HotspotsComponent = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          MODAL_SELECTOR = "modal-component",
          HOTSPOTS_FLOAT_ELEMENT = "hotspots-float-element",
          FLOAT_ELEMENT_BTN_SELECTOR = "float-element-btn";
        class HotspotsComponent extends base_component_1.BaseComponent {
          hasOpenFloatElement;
          mountComponent() {
            const modals = (0, utils_1.$list)(MODAL_SELECTOR, this),
              floatElements = (0, utils_1.$list)(HOTSPOTS_FLOAT_ELEMENT, this),
              floatElementsBtns = (0, utils_1.$list)(
                FLOAT_ELEMENT_BTN_SELECTOR,
                this
              );
            modals.forEach((modal) => {
              (0, utils_1.whenDefined)("modal-component").then(() => {
                modal.on("show", this.handleModalOpen),
                  modal.on("hide", this.handleModalHide);
              });
            }),
              floatElements.forEach((floatElement) => {
                (0, utils_1.whenDefined)("hotspots-float-element").then(() => {
                  floatElement.on("hide", this.handleFloatElementHide),
                    floatElement.on("show", this.handleFloatElementShow);
                });
              }),
              floatElementsBtns.forEach((btn) => {
                this.addListener(btn, "mouseenter", this.handlePinBtnEnter),
                  this.addListener(btn, "mouseleave", this.handlePinBtnLeave),
                  this.addListener(btn, "click", this.handlePinBtnClick);
              }),
              this.isEditor &&
                this.addListener(window, "click", this.handleEditorClick);
          }
          unmountComponent() {
            const modals = (0, utils_1.$list)(MODAL_SELECTOR, this),
              floatElements = (0, utils_1.$list)(HOTSPOTS_FLOAT_ELEMENT, this);
            modals.forEach((modal) => {
              (0, utils_1.whenDefined)("modal-component").then(() => {
                modal.off("show", this.handleModalOpen),
                  modal.off("hide", this.handleModalHide);
              });
            }),
              floatElements.forEach((floatElement) => {
                (0, utils_1.whenDefined)("hotspots-float-element").then(() => {
                  floatElement.off("hide", this.handleFloatElementHide),
                    floatElement.off("show", this.handleFloatElementShow);
                });
              });
          }
          handlePinBtnClick = (event) => {
            event.preventDefault(),
              this.setAttribute("animation-state", "pause");
          };
          handlePinBtnEnter = (event) => {
            event.preventDefault(),
              this.setAttribute("animation-state", "pause");
          };
          handlePinBtnLeave = (event) => {
            event.preventDefault(),
              !this.hasOpenFloatElement &&
                this.removeAttribute("animation-state");
          };
          handleFloatElementShow = () => {
            this.hasOpenFloatElement = !0;
          };
          handleFloatElementHide = () => {
            (this.hasOpenFloatElement = !1),
              this.removeAttribute("animation-state");
          };
          handleModalOpen = () => {
            this.setAttribute("animation-state", "pause");
          };
          handleModalHide = () => {
            this.removeAttribute("animation-state");
          };
          handleEditorClick = (event) => {
            const isTriggerBtn = (0, utils_1.$elParent)(
                FLOAT_ELEMENT_BTN_SELECTOR,
                event.target
              ),
              isFloatElement = (0, utils_1.$elParent)(
                HOTSPOTS_FLOAT_ELEMENT,
                event.target
              ),
              floatElements = (0, utils_1.$list)(HOTSPOTS_FLOAT_ELEMENT, this);
            isTriggerBtn ||
              isFloatElement ||
              floatElements.forEach((floatElement) => {
                floatElement.hide();
              });
          };
        }
        exports.HotspotsComponent = HotspotsComponent;
      },
      3891: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.HotspotsFloatElement = exports.HotspotsComponent = void 0);
        var hotspots_1 = __webpack_require__2(4717);
        Object.defineProperty(exports, "HotspotsComponent", {
          enumerable: !0,
          get: function () {
            return hotspots_1.HotspotsComponent;
          },
        });
        var hotspots_float_element_1 = __webpack_require__2(7041);
        Object.defineProperty(exports, "HotspotsFloatElement", {
          enumerable: !0,
          get: function () {
            return hotspots_float_element_1.HotspotsFloatElement;
          },
        });
      },
      9239: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ImageSlider = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          debounce_1 = __webpack_require__2(2731),
          key_1 = __webpack_require__2(9650);
        class ImageSlider extends base_component_1.BaseComponent {
          withProgressBar;
          withRotateImages;
          withVerticalScrollText;
          withVerticalScrollImage;
          carousel;
          progressBar;
          progressBarIndicator;
          progressDots;
          images;
          captions;
          arrows;
          dots;
          length;
          imagesLength;
          captionsLength;
          activeIndex;
          imagesContainer;
          captionHeight;
          touchStartX;
          intersectionObserver;
          resizeObserver;
          isMobile;
          windowClientHeight;
          scrollTriggerTop;
          scrollTriggerBottom;
          scrollDirection;
          lastScroll;
          constructor() {
            super(),
              (this.withProgressBar = this.hasAttribute("with-progress-bar")),
              (this.withRotateImages = this.hasAttribute("with-rotate-images")),
              (this.withVerticalScrollText = this.hasAttribute(
                "with-vertical-scroll"
              )),
              (this.withVerticalScrollImage = this.hasAttribute(
                "with-vertical-scroll-image"
              )),
              (this.carousel = (0, utils_1.$el)("carousel-component", this)),
              this.withRotateImages &&
                ((this.images = (0, utils_1.$list)(
                  "[data-image-slider-image]",
                  this
                )),
                (this.captions = (0, utils_1.$list)(
                  "[data-image-slider-caption]",
                  this
                )),
                (this.arrows = (0, utils_1.$list)("[data-direction]", this)),
                (this.dots = (0, utils_1.$list)("[data-progress-dot]", this)),
                (this.length = this.images.length - 1),
                (this.activeIndex = 0)),
              this.withRotateImages ||
                ((this.images = (0, utils_1.$list)(
                  "[data-image-slider-image]",
                  this
                )),
                (this.captions = (0, utils_1.$list)(
                  ".image-slider__slide",
                  this
                )),
                (this.activeIndex = 0),
                (this.length = this.images.length - 1)),
              this.withProgressBar &&
                ((this.progressBar = (0, utils_1.$el)(
                  "carousel-progress",
                  this
                )),
                (this.progressBarIndicator = this.querySelector(
                  "[data-carousel-progress-indicator]"
                )),
                (this.progressDots = (0, utils_1.$list)(
                  "[data-progress-dot]",
                  this
                ))),
              (this.withVerticalScrollText || this.withVerticalScrollImage) &&
                ((this.imagesContainer = this.querySelector(
                  "[data-carousel-viewport]"
                )),
                (this.images = (0, utils_1.$list)(
                  "[data-image-slider-image]",
                  this
                )),
                (this.captions = (0, utils_1.$list)(
                  "[data-image-slider-caption]",
                  this
                )),
                (this.captionHeight = this.images[0].offsetHeight),
                (this.imagesLength = this.images.filter(
                  (img) => img.firstElementChild.tagName !== "svg"
                ).length),
                (this.captionsLength = this.captions.length),
                (this.activeIndex = 0));
          }
          mountComponent() {
            this.withProgressBar &&
              !this.withRotateImages &&
              (0, utils_1.whenDefined)("carousel-component").then(() => {
                this.carousel?.on("carouselSelect", this.handleCarouselScroll);
              }),
              this.withRotateImages &&
                (this.withVerticalScrollText || this.stackImages(),
                this.arrows?.forEach((arrow) => {
                  arrow.addEventListener("click", this.handleArrowClick),
                    arrow.addEventListener("keydown", this.handleArrowKeydown);
                }),
                this.dots?.forEach((dot) => {
                  dot.addEventListener("click", this.handleDotClick);
                }),
                this.rotateImages(),
                this.toggleArrowsDisabled()),
              this.setAttribute("draggable", "true"),
              this.addEventListener("dragstart", this.handleDragStart),
              this.addEventListener("mousedown", this.handleTouchStart),
              this.addEventListener("touchstart", this.handleTouchStart),
              this.addEventListener("mouseup", this.handleTouchEnd),
              this.addEventListener("touchend", this.handleTouchEnd),
              this.withVerticalScrollText &&
                (this.stackImagesForVerticalScroll(),
                this.setObserversForVerticalScroll()),
              this.withVerticalScrollImage &&
                (this.setObserversForVerticalScrollImage(),
                this.addListener(
                  this,
                  "focusout",
                  this.handleVerticalImageFocusout
                )),
              this.carousel?.embla?.on("select", this.handleCarouselSelect),
              this.setComponentVisible();
          }
          handleCarouselSelect = (data) => {
            const newIndex = data.selectedScrollSnap();
            this.activeIndex = newIndex;
          };
          unmountComponent() {
            this.withProgressBar &&
              !this.withRotateImages &&
              this.carousel?.off("carouselSelect", this.handleCarouselScroll),
              this.withRotateImages &&
                (this.arrows?.forEach((arrow) => {
                  arrow.removeEventListener("click", this.handleArrowClick),
                    arrow.removeEventListener(
                      "keydown",
                      this.handleArrowKeydown
                    );
                }),
                this.withProgressBar &&
                  this.dots?.forEach((dot) => {
                    dot.removeEventListener("click", this.handleDotClick);
                  })),
              this.removeEventListener("dragstart", this.handleTouchStart),
              this.removeEventListener("mousedown", this.handleTouchStart),
              this.removeEventListener("touchstart", this.handleTouchStart),
              this.removeEventListener("mouseup", this.handleTouchEnd),
              this.removeEventListener("touchend", this.handleTouchEnd),
              this.withVerticalScrollText &&
                (this.intersectionObserver.disconnect(),
                this.resizeObserver.disconnect()),
              window.removeEventListener("scroll", this.handleChangeOpacity);
          }
          handleVerticalImageFocusout = (event) => {
            const focusTarget = event.relatedTarget;
            if (this.contains(focusTarget)) {
              const blockId = focusTarget
                  .closest("[data-image-slider-caption]")
                  .getAttribute("data-image-slider-caption"),
                imageSlider = (0, utils_1.$el)(
                  `[data-image-slider-image="${blockId}"]`
                );
              imageSlider &&
                (0, utils_1.isNotThemeStore)() &&
                imageSlider.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
            }
          };
          handleVerticalScroll = (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const inViewIndex = Number(
                  entry.target.parentElement.getAttribute(
                    "data-image-slider-caption"
                  )
                );
                if (inViewIndex === this.activeIndex) return;
                if (this.imagesLength === 1) {
                  this.activeIndex = inViewIndex;
                  return;
                }
                if (this.withRotateImages) {
                  const direction =
                    inViewIndex > this.activeIndex ? "next" : "prev";
                  this.changeSlides(direction, inViewIndex);
                } else
                  this.images.forEach((img, index) => {
                    index === inViewIndex
                      ? (img.setAttribute("visible", ""),
                        img.removeAttribute("prev"),
                        img.removeAttribute("next"))
                      : index < inViewIndex
                      ? (img.setAttribute("prev", ""),
                        img.removeAttribute("visible"),
                        img.removeAttribute("next"))
                      : index > inViewIndex &&
                        (img.setAttribute("next", ""),
                        img.removeAttribute("visible"),
                        img.removeAttribute("prev"));
                  });
                this.activeIndex = inViewIndex;
              }
            });
          };
          setObserversForVerticalScroll = () => {
            let imagesHeight =
              this.imagesContainer.getBoundingClientRect().height;
            (this.windowClientHeight = document.documentElement.clientHeight),
              imagesHeight > this.windowClientHeight &&
                (this.images.forEach((image) => {
                  image.style.maxHeight = `${this.windowClientHeight - 30}px`;
                }),
                (imagesHeight =
                  this.imagesContainer.getBoundingClientRect().height));
            const topToSet = (this.windowClientHeight - imagesHeight) / 2;
            (this.imagesContainer.style.top = `${topToSet}px`),
              (this.scrollTriggerTop = topToSet),
              (this.scrollTriggerBottom =
                this.windowClientHeight - this.scrollTriggerTop - imagesHeight),
              (this.intersectionObserver = new IntersectionObserver(
                this.handleVerticalScroll,
                {
                  rootMargin: `0px 0px -${this.scrollTriggerBottom + 30}px 0px`,
                }
              )),
              this.captions.forEach((caption) => {
                (caption.style.minHeight = `${this.captionHeight}px`),
                  caption.firstElementChild &&
                    this.intersectionObserver.observe(
                      caption.firstElementChild
                    );
              }),
              this.imagesLength === 1 &&
                this.images.forEach((img, index) => {
                  img.firstElementChild.tagName !== "svg"
                    ? (img.setAttribute("visible", ""),
                      img.removeAttribute("prev"),
                      img.removeAttribute("next"))
                    : (img.removeAttribute("next"),
                      img.removeAttribute("visible"),
                      img.removeAttribute("prev"),
                      (img.style.opacity = "0"));
                }),
              (this.resizeObserver = new ResizeObserver(
                this.handleResizeVerticalScroll
              )),
              this.resizeObserver.observe(this),
              this.setObserveScroll();
          };
          setObserveScroll = () => {
            (this.lastScroll = 0),
              window.addEventListener("scroll", this.handleChangeOpacity);
          };
          handleChangeOpacity = () => {
            const scrollTop = document.documentElement.scrollTop,
              scrollDirection = this.lastScroll > scrollTop ? "up" : "down";
            (this.lastScroll = scrollTop),
              this.captions.forEach((caption, index) => {
                const bottom =
                    caption.lastElementChild.getBoundingClientRect().bottom,
                  top = caption.firstElementChild.getBoundingClientRect().top;
                if (
                  bottom < 0 ||
                  top > this.windowClientHeight ||
                  (index === this.captions.length - 1 &&
                    this.windowClientHeight - bottom >
                      this.scrollTriggerBottom &&
                    scrollDirection === "down")
                ) {
                  caption.setAttribute("dont-set-opacity", ""),
                    (caption.style.opacity = "1");
                  return;
                }
                const captionHeight = bottom - top,
                  persentToTop =
                    (bottom - this.scrollTriggerTop) / captionHeight,
                  persentToBottom =
                    (this.windowClientHeight - top - this.scrollTriggerBottom) /
                    captionHeight;
                caption.hasAttribute("dont-set-opacity") ||
                  (caption.style.opacity =
                    top < this.scrollTriggerTop
                      ? `${persentToTop}`
                      : `${persentToBottom}`);
                const bottomLimit =
                  caption.getBoundingClientRect().height <
                  this.imagesContainer.getBoundingClientRect().height
                    ? this.scrollTriggerBottom
                    : this.scrollTriggerBottom -
                      (caption.getBoundingClientRect().height -
                        this.imagesContainer.getBoundingClientRect().height +
                        20);
                caption.hasAttribute("dont-set-opacity") &&
                  this.windowClientHeight - bottom > bottomLimit &&
                  top > this.scrollTriggerTop &&
                  caption.removeAttribute("dont-set-opacity");
              });
          };
          handleVerticalScrollImage = (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const inViewIndex = Number(
                  entry.target.getAttribute("data-image-slider-image")
                );
                if (inViewIndex === this.activeIndex) return;
                this.images[inViewIndex].setAttribute("visible", ""),
                  this.images[this.activeIndex].removeAttribute("visible"),
                  this.captionsLength > 1 &&
                    (this.captions[inViewIndex].setAttribute("visible", ""),
                    this.captions[this.activeIndex].removeAttribute("visible")),
                  (this.activeIndex = inViewIndex);
              }
            });
          };
          setObserversForVerticalScrollImage = () => {
            const windowHeight = document.documentElement.clientHeight;
            this.intersectionObserver = new IntersectionObserver(
              this.handleVerticalScrollImage,
              { rootMargin: "-40% 0% -50% 0%" }
            );
            let captionMaxHeight = 0;
            this.captions.forEach((caption, index) => {
              const top = caption.firstElementChild.getBoundingClientRect().top,
                height =
                  caption.lastElementChild.getBoundingClientRect().bottom - top;
              captionMaxHeight < height && (captionMaxHeight = height),
                height < this.images[index].getBoundingClientRect().height &&
                  (caption.style.height =
                    this.images[index].getBoundingClientRect().height + "px");
            }),
              this.images.find(
                (image) =>
                  image.getBoundingClientRect().height < captionMaxHeight
              ) &&
                (this.imagesContainer.style.gap =
                  (captionMaxHeight -
                    this.images[0].getBoundingClientRect().height) *
                    2 +
                  "px");
            const captionsParent = this.captions[0].parentElement;
            if (captionMaxHeight < windowHeight) {
              const parentHeight =
                  captionsParent.getBoundingClientRect().height,
                topToSet = (windowHeight - parentHeight) / 2;
              captionsParent.style.top = `${topToSet}px`;
            } else captionsParent.style.top = "0px";
            this.images.forEach((image) => {
              this.intersectionObserver.observe(image);
            }),
              this.captionsLength === 1 &&
                this.captions[0].setAttribute("visible", "");
          };
          handleArrowClick = (event) => {
            const direction =
              event.currentTarget.getAttribute("data-direction");
            this.arrowMove(direction),
              this.withProgressBar || this.toogleProgressDotActive();
          };
          handleArrowKeydown = (event) => {
            const direction =
              event.currentTarget.getAttribute("data-direction");
            (0, key_1.isEnterKey)(event) && this.arrowMove(direction);
          };
          arrowMove(direction) {
            let newIndex;
            direction === "next"
              ? (newIndex =
                  this.activeIndex === this.length ? 0 : this.activeIndex + 1)
              : (newIndex =
                  this.activeIndex - 1 < 0
                    ? this.length
                    : this.activeIndex - 1),
              this.changeSlides(direction, newIndex),
              this.withRotateImages && this.toggleArrowsDisabled(),
              this.withProgressBar &&
                this.withRotateImages &&
                (this.toogleProgressDotActive(), this.setProgressIndicator());
          }
          toggleArrowsDisabled = () => {
            this.arrows?.forEach((arrow) => {
              arrow.getAttribute("data-direction") === "prev"
                ? arrow.toggleAttribute("disabled", this.activeIndex === 0)
                : arrow.toggleAttribute(
                    "disabled",
                    this.activeIndex === this.length
                  );
            });
          };
          handleDotClick = (event) => {
            const index = event.currentTarget.hasAttribute("data-dot-index")
              ? +event.currentTarget.getAttribute("data-dot-index")
              : +event.target
                  .closest("[data-progress-dot]")
                  .getAttribute("data-dot-index");
            if (index === this.activeIndex) return;
            let direction = index > this.activeIndex ? "next" : "prev";
            this.activeIndex === 0 &&
              index === this.length &&
              (direction = "prev"),
              index - this.activeIndex > 1 && (direction = "prev"),
              this.activeIndex === this.length &&
                index === 0 &&
                (direction = "next"),
              this.changeSlides(direction, index);
          };
          changeNoRotateSlides = (direction, newIndex) => {
            this.carousel.embla.scrollTo(newIndex),
              (this.activeIndex = newIndex);
          };
          changeSlides = (direction, newIndex) => {
            const currentCaption = this.captions[this.activeIndex];
            currentCaption.addEventListener(
              "transitionend",
              this.animationCaptionEnd
            ),
              currentCaption.removeAttribute("visible");
            const imageToAnimate =
              direction === "next"
                ? this.images[this.activeIndex]
                : this.images[newIndex];
            imageToAnimate.addEventListener(
              "animationend",
              this.animationImageEnd
            ),
              direction === "next"
                ? imageToAnimate.setAttribute("animating-forward", "")
                : imageToAnimate.setAttribute("animating-backward", ""),
              (this.activeIndex = newIndex),
              this.toogleProgressDotActive(),
              this.setProgressIndicator(),
              this.toggleArrowsDisabled();
          };
          animationCaptionEnd = (event) => {
            const element = event.currentTarget;
            this.captions[this.activeIndex].setAttribute("visible", ""),
              element.removeEventListener(
                "transitionend",
                this.animationCaptionEnd
              );
          };
          animationImageEnd = (event) => {
            const element = event.currentTarget;
            element.removeAttribute("animating-forward"),
              element.removeAttribute("animating-backward"),
              element.removeEventListener(
                "animationend",
                this.animationImageEnd
              ),
              this.stackImages();
          };
          stackImages = () => {
            this.images.forEach((img, index) => {
              index === this.activeIndex
                ? (img.style.zIndex = String(0))
                : index > this.activeIndex
                ? (img.style.zIndex = String(this.activeIndex - index))
                : index < this.activeIndex &&
                  (img.style.zIndex = String(-this.length - index + 1));
            });
          };
          stackImagesForVerticalScroll = () => {
            this.images.forEach((img, index) => {
              img.style.zIndex = this.withRotateImages
                ? `-${index}`
                : `${index}`;
            });
          };
          handleResizeVerticalScroll = (0, debounce_1.debounce)(() => {
            (this.captionHeight = this.images[0].offsetHeight),
              this.captions.forEach((caption) => {
                caption.style.minHeight = `${this.captionHeight}px`;
              });
          }, 300);
          rotateImages = () => {
            if (this.withVerticalScrollImage)
              this.images.forEach((img, index) => {
                img.style.transform =
                  index % 2 === 0 ? `rotate(${1.7}deg)` : `rotate(-${1.7}deg)`;
              });
            else {
              let prevMinus = 0,
                prevPlus = 0;
              this.images.forEach((img, index) => {
                if ((index + 1) % 3 === 0) {
                  const deg = prevMinus + 2.5;
                  (img.style.transform = `rotate(${deg}deg)`),
                    (prevMinus = deg);
                } else {
                  const deg = prevPlus - 1.5;
                  (img.style.transform = `rotate(${deg}deg)`), (prevPlus = deg);
                }
              });
            }
          };
          handleCarouselScroll = (data) => {
            this.withProgressBar &&
              !this.withRotateImages &&
              this.toogleProgressDotActive();
          };
          toogleProgressDotActive = () => {
            const selectedScrollSnap = this.getSelectedScrollSnap();
            (this.withProgressBar ? this.progressDots : this.dots)?.forEach(
              (dot, index) => {
                dot.classList.toggle(
                  "image-slider__progress-bar-dot--passed",
                  index < selectedScrollSnap
                ),
                  dot.classList.toggle(
                    "is-primary",
                    index === this.activeIndex
                  );
              }
            );
          };
          setProgressIndicator = () => {
            if (this.progressBarIndicator) {
              const progress =
                (this.getSelectedScrollSnap() / this.length) * 100;
              this.progressBarIndicator.style.transform = `translate3d(${progress}%, 0, 0)`;
            }
          };
          getSelectedScrollSnap = () =>
            this.carousel?.embla.selectedScrollSnap() ?? this.activeIndex;
          setComponentVisible = () => {
            this.setAttribute("visible", "");
          };
          handleDragStart = (event) => (event.preventDefault(), !1);
          handleTouchStart = (event) => {
            this.touchStartX = event.clientX ?? event.touches[0].clientX;
          };
          handleTouchEnd = (event) => {
            if (event.target.closest("[data-progress-dot]")) {
              this.handleDotClick(event);
              return;
            }
            if (this.touchStartX === 0) return;
            const currentX = event.clientX ?? event.changedTouches[0].clientX,
              swipeLeft = currentX - this.touchStartX < -20,
              swipeRight = currentX - this.touchStartX > 20;
            swipeLeft &&
              this.activeIndex !== this.length &&
              this.handleSwipe("next"),
              swipeRight && this.activeIndex !== 0 && this.handleSwipe("prev"),
              (this.touchStartX = 0);
          };
          handleSwipe = (direction) => {
            let newIndex;
            direction === "next"
              ? (newIndex =
                  this.activeIndex === this.length ? 0 : this.activeIndex + 1)
              : (newIndex =
                  this.activeIndex - 1 < 0
                    ? this.length
                    : this.activeIndex - 1),
              this.withRotateImages ||
                this.changeNoRotateSlides(direction, newIndex),
              this.withRotateImages &&
                (this.changeSlides(direction, newIndex),
                this.toggleArrowsDisabled()),
              this.withProgressBar &&
                this.withRotateImages &&
                (this.toogleProgressDotActive(), this.setProgressIndicator());
          };
        }
        exports.ImageSlider = ImageSlider;
      },
      5374: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.LookbookComponent = exports.LookbookModal = void 0);
        var lookbook_modal_1 = __webpack_require__2(5914);
        Object.defineProperty(exports, "LookbookModal", {
          enumerable: !0,
          get: function () {
            return lookbook_modal_1.LookbookModal;
          },
        });
        var lookbook_1 = __webpack_require__2(2263);
        Object.defineProperty(exports, "LookbookComponent", {
          enumerable: !0,
          get: function () {
            return lookbook_1.LookbookComponent;
          },
        });
      },
      5914: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.LookbookModal = void 0);
        const utils_1 = __webpack_require__2(4083),
          modal_1 = __webpack_require__2(2549),
          LOOKBOOK_SELECTOR = "lookbook-component";
        class LookbookModal extends modal_1.ModalComponent {
          async show() {
            await super.show();
            const lookbook = (0, utils_1.$elParent)(LOOKBOOK_SELECTOR, this);
            lookbook?.showBlockById(lookbook.selectedPinId);
          }
        }
        exports.LookbookModal = LookbookModal;
      },
      2263: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.LookbookComponent = void 0);
        const check_media_1 = __webpack_require__2(5580),
          debounce_1 = __webpack_require__2(2731),
          base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          PIN_SELECTOR = "[data-lookbook-pin]",
          BLOCK_SELECTOR = "[data-lookbook-block]",
          MODAL_SELECTOR = "[data-lookbook-modal]",
          CAROUSEL_SELECTOR = "slider-grid:not([with-grid])",
          CAROUSEL_TRACK_SELECTOR =
            "[data-lookbook-mobile-content] [slider-grid-track]",
          DESKTOP_CONTENT_SELECTOR = "[data-lookbook-desktop-content]",
          MOBILE_CONTENT_SELECTOR = "[data-lookbook-mobile-content]";
        class LookbookComponent extends base_component_1.BaseComponent {
          animationPausedAttribute = "animation-paused";
          selectedPinId;
          notHighlightedAttribute = "not-highlighted";
          pins;
          highlightedBlockId;
          resizeObserver;
          carouselTrack;
          mountComponent() {
            (0, utils_1.$list)(PIN_SELECTOR, this).forEach((pin) => {
              this.addListener(pin, "mouseenter", this.handlePinEnter),
                this.addListener(pin, "mouseleave", this.handlePinLeave),
                this.addListener(pin, "click", this.handlePinClick);
            }),
              (this.resizeObserver = new ResizeObserver(this.handleResize)),
              this.resizeObserver.observe(this),
              (0, check_media_1.isMobile)() &&
                (this.carouselTrack = (0, utils_1.$el)(
                  CAROUSEL_TRACK_SELECTOR,
                  this
                ));
          }
          unmountComponent() {
            this.resizeObserver.disconnect();
          }
          handlePinEnter = () => {
            this.setAnimationPausedState(!0);
          };
          handlePinLeave = () => {
            this.highlightedBlockId || this.setAnimationPausedState(!1);
          };
          handleResize = (0, debounce_1.debounce)(() => {
            this.showBlockById(this.highlightedBlockId);
          }, 500);
          handlePinClick = (event) => {
            const pin = event.target,
              blockId = pin.dataset.blockId;
            (this.selectedPinId = blockId),
              pin.parentElement.tagName !== "MODAL-BUTTON" &&
                this.showBlockById(blockId),
              this.setListeners();
          };
          handleOutsideClick = (event) => {
            (0, utils_1.$elParent)(PIN_SELECTOR, event.target) ||
              (this.showBlockById(), this.removeListeners());
          };
          handlePointerMove = () => {
            this.showBlockById(), this.removeListeners();
          };
          setListeners = () => {
            this.addListener(window, "click", this.handleOutsideClick),
              this.carouselTrack &&
                this.addListener(
                  this.carouselTrack,
                  "pointermove",
                  this.handlePointerMove
                );
          };
          removeListeners = () => {
            this.removeListener(window, "click", this.handleOutsideClick),
              this.carouselTrack &&
                this.removeListener(
                  this.carouselTrack,
                  "pointermove",
                  this.handlePointerMove
                );
          };
          showBlockById(blockId) {
            this.updateSelectedStateForPins(blockId),
              blockId
                ? (this.setHighlightBlockById(blockId),
                  this.setAnimationPausedState(!0))
                : (this.resetHighlight(), this.setAnimationPausedState(!1)),
              (this.highlightedBlockId = blockId);
          }
          updateSelectedStateForPins(blockId) {
            (0, utils_1.$list)(PIN_SELECTOR, this).forEach((pin) => {
              pin.toggleAttribute(
                "is-selected",
                pin.dataset.blockId === blockId
              );
            });
          }
          setAnimationPausedState(isAnimationPaused) {
            this.toggleAttribute(
              this.animationPausedAttribute,
              isAnimationPaused
            );
          }
          setHighlightBlockById(blockId) {
            this.blocks.forEach((block, index) => {
              const isHighlighted = block.dataset.blockId === blockId;
              isHighlighted && this.scrollToProductByIndex(index),
                block.removeAttribute("style"),
                block.toggleAttribute(
                  this.notHighlightedAttribute,
                  !isHighlighted
                );
            });
          }
          scrollToProductByIndex(index) {
            const block = this.blocks[index],
              carousel = (0, utils_1.$elParent)(CAROUSEL_SELECTOR, block);
            carousel
              ? carousel.scrollSlideIntoView(index)
              : (0, utils_1.isNotThemeStore)() &&
                block.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          resetHighlight() {
            this.blocks.forEach((block) => {
              block.removeAttribute(this.notHighlightedAttribute);
            });
          }
          get blocks() {
            const desktopContent = (0, utils_1.$el)(
                DESKTOP_CONTENT_SELECTOR,
                this
              ),
              mobileContent = (0, utils_1.$el)(MOBILE_CONTENT_SELECTOR, this),
              content = (0, check_media_1.isMobile)()
                ? mobileContent
                : desktopContent,
              modal = (0, utils_1.$el)(MODAL_SELECTOR, content),
              node = modal ? modal.element : content;
            return (0, utils_1.$list)(BLOCK_SELECTOR, node);
          }
        }
        exports.LookbookComponent = LookbookComponent;
      },
      2262: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.StoreLocator = void 0);
        var store_locator_1 = __webpack_require__2(2803);
        Object.defineProperty(exports, "StoreLocator", {
          enumerable: !0,
          get: function () {
            return store_locator_1.StoreLocator;
          },
        });
      },
      6942: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.MapComponent = void 0);
        const base_component_1 = __webpack_require__2(3608),
          js_api_loader_1 = __webpack_require__2(3311),
          styles_1 = __webpack_require__2(8566);
        class MapComponent extends base_component_1.BaseComponent {
          styleAttribute = "data-map-style";
          customStyleAttribute = "data-map-custom-style";
          zoomAttribute = "data-map-zoom";
          defaultZoom = 10;
          api_key;
          locationsData = [];
          locations = [];
          center = { lat: 0, lng: 0 };
          markers = [];
          mapStyle;
          mapCustomStyle;
          zoom;
          map;
          constructor() {
            super(),
              (this.api_key = this.dataset.key),
              (this.mapStyle = this.getAttribute(this.styleAttribute)),
              (this.mapCustomStyle = this.toJSON(
                this.getAttribute(this.customStyleAttribute)
              )),
              (this.zoom =
                +this.getAttribute(this.zoomAttribute) || this.defaultZoom);
          }
          async mountComponent() {
            (window.gm_authFailure = this.handleErrors),
              this.locationsData.length > 0 && (await this.initMap());
          }
          unmountComponent() {
            window.gm_authFailure = null;
          }
          initMap = async () => {
            try {
              await new js_api_loader_1.Loader({
                apiKey: this.api_key,
                version: "weekly",
              }).load(),
                (this.locations = this.generateMapLocations()),
                this.calcMapCenter(),
                this.setMap(),
                this.setMarkers();
            } catch (error) {
              this.handleErrors(error);
            }
          };
          generateMapLocations = () => {
            const data = [];
            for (const store of this.locationsData) {
              const { id, coordinates } = store,
                location = this.generateCoordinatesFromString(coordinates);
              location && data.push({ id, location });
            }
            return data;
          };
          setMap = () => {
            const map = new google.maps.Map(this, {
              zoom: this.locations.length > 0 ? this.zoom : 0,
              center: this.center,
              styles: this.mapCustomStyle ?? styles_1.mapStyles[this.mapStyle],
            });
            this.map = map;
          };
          setMarkers = () => {
            this.locations.length !== 0 &&
              this.locations.map((location) => {
                const marker = new google.maps.Marker({
                  map: this.map,
                  position: location.location,
                  id: location.id,
                });
                this.locations.length > 1 &&
                  marker.addListener("click", (event) => {
                    this.emit("markerClick", { markerId: location.id });
                  }),
                  this.markers.push(marker);
              });
          };
          generateCoordinatesFromString = (string) => {
            const array = string.split(","),
              lat = +array[0],
              lng = +array[1];
            if (!(!lat || !lng)) return { lat, lng };
          };
          calcMapCenter() {
            const locationsLength = this.locations.length;
            if (locationsLength > 0) {
              const center = { lat: 0, lng: 0 };
              this.locations.forEach((location) => {
                (center.lat = center.lat + location.location.lat),
                  (center.lng = center.lng + location.location.lng);
              }),
                (center.lat = center.lat / locationsLength),
                (center.lng = center.lng / locationsLength),
                (this.center = center);
            }
          }
          highlightMarker(id) {
            this.markers.forEach((marker) => {
              if (!id) {
                marker.setOpacity(1);
                return;
              }
              marker.id === id ? marker.setOpacity(1) : marker.setOpacity(0.5);
            });
          }
          toJSON = (str) => {
            try {
              return JSON.parse(str);
            } catch {
              return null;
            }
          };
          handleErrors = (error) => {
            console.log(error), this.emit("mapError", {});
          };
        }
        exports.MapComponent = MapComponent;
      },
      2803: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.StoreLocator = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          check_media_1 = __webpack_require__2(5580);
        class StoreLocator extends base_component_1.BaseComponent {
          mapSelector = "#map";
          storeElementSelector = "data-store";
          storeIdSelector = "data-block-id";
          storeNameSelector = "data-name";
          storeCoordinatesSelector = "data-coordinates";
          defaultImageSelector = "map-default-image";
          map;
          stores;
          constructor() {
            super(),
              (this.map = (0, utils_1.$el)(this.mapSelector, this)),
              (this.stores = (0, utils_1.$list)(
                `[${this.storeElementSelector}]`,
                this
              ));
          }
          mountComponent() {
            this.map &&
              ((this.map.locationsData = this.generateLocationsData()),
              this.map.initMap(),
              this.map?.on("markerClick", this.handleMarkerClick),
              this.map?.on("mapError", this.handleMapError)),
              this.stores.forEach((store) => {
                this.addListener(store, "click", this.handleStoreClick);
              });
          }
          unmountComponent() {
            this.map &&
              (this.map.off("markerClick", this.handleMarkerClick),
              this.map.off("mapError", this.handleMapError));
          }
          generateLocationsData = () =>
            this.stores.map((store) => ({
              coordinates: store.getAttribute(this.storeCoordinatesSelector),
              id: store.getAttribute(this.storeIdSelector),
            }));
          handleMarkerClick = ({ markerId }) => {
            const storeToScrollTo = this.stores.find(
              (store) => store.dataset.blockId === markerId
            );
            (0, utils_1.isNotThemeStore)() &&
              storeToScrollTo?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              }),
              storeToScrollTo?.show(),
              this.toggleStoreVisibility(markerId);
          };
          handleStoreClick = ({ currentTarget }) => {
            const storeId = currentTarget.getAttribute(this.storeIdSelector);
            this.toggleStoreVisibility(storeId),
              (0, check_media_1.isMobile)() &&
                currentTarget.isExpanded &&
                this.scrollToTabTop(currentTarget);
          };
          scrollToTabTop = async (element) => {
            await (0, utils_1.transitionToPromise)(element);
            const top = element.getBoundingClientRect().top;
            top < 0 &&
              window.scrollBy({ top: top - 100, left: 0, behavior: "smooth" });
          };
          toggleStoreVisibility = (id) => {
            this.toggleStoreExpanded(id), this.toggleMarkerHighlighted(id);
          };
          toggleStoreExpanded = (id) => {
            this.stores.forEach((store) => {
              store.dataset.blockId !== id && store.isExpanded && store.hide();
            });
          };
          toggleMarkerHighlighted = (id) => {
            this.stores.find((store) => store.isExpanded)
              ? this.map?.highlightMarker(id)
              : this.map?.highlightMarker(null);
          };
          setDefaultImage = () => {
            const image = (0, utils_1.$el)(
              `[${this.defaultImageSelector}]`,
              this
            )?.content;
            this.map?.replaceWith(image);
          };
          handleMapError = () => {
            this.setDefaultImage();
          };
        }
        exports.StoreLocator = StoreLocator;
      },
      8566: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.mapStyles = void 0),
          (exports.mapStyles = {
            silver: [
              { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
              { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
              {
                elementType: "labels.text.fill",
                stylers: [{ color: "#616161" }],
              },
              {
                elementType: "labels.text.stroke",
                stylers: [{ color: "#f5f5f5" }],
              },
              {
                featureType: "administrative.land_parcel",
                elementType: "labels.text.fill",
                stylers: [{ color: "#bdbdbd" }],
              },
              {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{ color: "#eeeeee" }],
              },
              {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#757575" }],
              },
              {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#e5e5e5" }],
              },
              {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9e9e9e" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#ffffff" }],
              },
              {
                featureType: "road.arterial",
                elementType: "labels.text.fill",
                stylers: [{ color: "#757575" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#dadada" }],
              },
              {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#616161" }],
              },
              {
                featureType: "road.local",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9e9e9e" }],
              },
              {
                featureType: "transit.line",
                elementType: "geometry",
                stylers: [{ color: "#e5e5e5" }],
              },
              {
                featureType: "transit.station",
                elementType: "geometry",
                stylers: [{ color: "#eeeeee" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#c9c9c9" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9e9e9e" }],
              },
            ],
            retro: [
              { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
              {
                elementType: "labels.text.fill",
                stylers: [{ color: "#523735" }],
              },
              {
                elementType: "labels.text.stroke",
                stylers: [{ color: "#f5f1e6" }],
              },
              {
                featureType: "administrative",
                elementType: "geometry.stroke",
                stylers: [{ color: "#c9b2a6" }],
              },
              {
                featureType: "administrative.land_parcel",
                elementType: "geometry.stroke",
                stylers: [{ color: "#dcd2be" }],
              },
              {
                featureType: "administrative.land_parcel",
                elementType: "labels.text.fill",
                stylers: [{ color: "#ae9e90" }],
              },
              {
                featureType: "landscape.natural",
                elementType: "geometry",
                stylers: [{ color: "#dfd2ae" }],
              },
              {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{ color: "#dfd2ae" }],
              },
              {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#93817c" }],
              },
              {
                featureType: "poi.park",
                elementType: "geometry.fill",
                stylers: [{ color: "#a5b076" }],
              },
              {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#447530" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#f5f1e6" }],
              },
              {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [{ color: "#fdfcf8" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#f8c967" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#e9bc62" }],
              },
              {
                featureType: "road.highway.controlled_access",
                elementType: "geometry",
                stylers: [{ color: "#e98d58" }],
              },
              {
                featureType: "road.highway.controlled_access",
                elementType: "geometry.stroke",
                stylers: [{ color: "#db8555" }],
              },
              {
                featureType: "road.local",
                elementType: "labels.text.fill",
                stylers: [{ color: "#806b63" }],
              },
              {
                featureType: "transit.line",
                elementType: "geometry",
                stylers: [{ color: "#dfd2ae" }],
              },
              {
                featureType: "transit.line",
                elementType: "labels.text.fill",
                stylers: [{ color: "#8f7d77" }],
              },
              {
                featureType: "transit.line",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#ebe3cd" }],
              },
              {
                featureType: "transit.station",
                elementType: "geometry",
                stylers: [{ color: "#dfd2ae" }],
              },
              {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [{ color: "#b9d3c2" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#92998d" }],
              },
            ],
            dark: [
              { elementType: "geometry", stylers: [{ color: "#212121" }] },
              { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
              {
                elementType: "labels.text.fill",
                stylers: [{ color: "#757575" }],
              },
              {
                elementType: "labels.text.stroke",
                stylers: [{ color: "#212121" }],
              },
              {
                featureType: "administrative",
                elementType: "geometry",
                stylers: [{ color: "#757575" }],
              },
              {
                featureType: "administrative.country",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9e9e9e" }],
              },
              {
                featureType: "administrative.land_parcel",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#bdbdbd" }],
              },
              {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#757575" }],
              },
              {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#181818" }],
              },
              {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#616161" }],
              },
              {
                featureType: "poi.park",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#1b1b1b" }],
              },
              {
                featureType: "road",
                elementType: "geometry.fill",
                stylers: [{ color: "#2c2c2c" }],
              },
              {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#8a8a8a" }],
              },
              {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [{ color: "#373737" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#3c3c3c" }],
              },
              {
                featureType: "road.highway.controlled_access",
                elementType: "geometry",
                stylers: [{ color: "#4e4e4e" }],
              },
              {
                featureType: "road.local",
                elementType: "labels.text.fill",
                stylers: [{ color: "#616161" }],
              },
              {
                featureType: "transit",
                elementType: "labels.text.fill",
                stylers: [{ color: "#757575" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#000000" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#3d3d3d" }],
              },
            ],
            night: [
              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
              {
                elementType: "labels.text.fill",
                stylers: [{ color: "#746855" }],
              },
              {
                elementType: "labels.text.stroke",
                stylers: [{ color: "#242f3e" }],
              },
              {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#263c3f" }],
              },
              {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b9a76" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }],
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }],
              },
              {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#746855" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1f2835" }],
              },
              {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#f3d19c" }],
              },
              {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{ color: "#2f3948" }],
              },
              {
                featureType: "transit.station",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }],
              },
            ],
            aubergine: [
              { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
              {
                elementType: "labels.text.fill",
                stylers: [{ color: "#8ec3b9" }],
              },
              {
                elementType: "labels.text.stroke",
                stylers: [{ color: "#1a3646" }],
              },
              {
                featureType: "administrative.country",
                elementType: "geometry.stroke",
                stylers: [{ color: "#4b6878" }],
              },
              {
                featureType: "administrative.land_parcel",
                elementType: "labels.text.fill",
                stylers: [{ color: "#64779e" }],
              },
              {
                featureType: "administrative.province",
                elementType: "geometry.stroke",
                stylers: [{ color: "#4b6878" }],
              },
              {
                featureType: "landscape.man_made",
                elementType: "geometry.stroke",
                stylers: [{ color: "#334e87" }],
              },
              {
                featureType: "landscape.natural",
                elementType: "geometry",
                stylers: [{ color: "#023e58" }],
              },
              {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{ color: "#283d6a" }],
              },
              {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6f9ba5" }],
              },
              {
                featureType: "poi",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#1d2c4d" }],
              },
              {
                featureType: "poi.park",
                elementType: "geometry.fill",
                stylers: [{ color: "#023e58" }],
              },
              {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#3C7680" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#304a7d" }],
              },
              {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#98a5be" }],
              },
              {
                featureType: "road",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#1d2c4d" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#2c6675" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#255763" }],
              },
              {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#b0d5ce" }],
              },
              {
                featureType: "road.highway",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#023e58" }],
              },
              {
                featureType: "transit",
                elementType: "labels.text.fill",
                stylers: [{ color: "#98a5be" }],
              },
              {
                featureType: "transit",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#1d2c4d" }],
              },
              {
                featureType: "transit.line",
                elementType: "geometry.fill",
                stylers: [{ color: "#283d6a" }],
              },
              {
                featureType: "transit.station",
                elementType: "geometry",
                stylers: [{ color: "#3a4762" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#0e1626" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#4e6d70" }],
              },
            ],
          });
      },
      4504: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PasswordModalButton = exports.PasswordModal = void 0);
        var password_modal_1 = __webpack_require__2(3525);
        Object.defineProperty(exports, "PasswordModal", {
          enumerable: !0,
          get: function () {
            return password_modal_1.PasswordModal;
          },
        });
        var password_modal_button_1 = __webpack_require__2(5777);
        Object.defineProperty(exports, "PasswordModalButton", {
          enumerable: !0,
          get: function () {
            return password_modal_button_1.PasswordModalButton;
          },
        });
      },
      5777: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PasswordModalButton = void 0);
        const modal_button_1 = __webpack_require__2(467);
        class PasswordModalButton extends modal_button_1.ModalButton {
          mountComponent() {
            super.mountComponent(), this.focus();
          }
        }
        exports.PasswordModalButton = PasswordModalButton;
      },
      3525: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PasswordModal = void 0);
        const utils_1 = __webpack_require__2(4083),
          modal_1 = __webpack_require__2(2549),
          INPUT_SELECTOR = "[password-modal-input]";
        class PasswordModal extends modal_1.ModalComponent {
          async show() {
            super.show(), (0, utils_1.$el)(INPUT_SELECTOR, this)?.focus();
          }
        }
        exports.PasswordModal = PasswordModal;
      },
      6502: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ConditionRuntime = void 0);
        const check_media_1 = __webpack_require__2(5580),
          utils_1 = __webpack_require__2(4142),
          timeDelayToMs = (delay) => {
            switch (delay) {
              case "none":
                return 0;
              case "3sec":
                return 3e3;
              case "5sec":
                return 5e3;
              case "15sec":
                return 15e3;
              case "30sec":
                return 3e4;
              case "1min":
                return 6e4;
              case "2min":
                return 12e4;
            }
          },
          frequencyToMs = (delay) => {
            switch (delay) {
              case "1h":
                return 60 * 60 * 1e3;
              case "12h":
                return 12 * 60 * 60 * 1e3;
              case "1d":
                return 24 * 60 * 60 * 1e3;
              case "3d":
                return 3 * 24 * 60 * 60 * 1e3;
              case "1w":
                return 7 * 24 * 60 * 60 * 1e3;
              case "2w":
                return 14 * 24 * 60 * 60 * 1e3;
              default:
                return 0;
            }
          },
          SCROLL_THRESHOLD = { 25: 20, 50: 40, 75: 55, 100: 99 },
          clearTag = (str) => str.toLowerCase().replace(/\s+/g, "");
        class ConditionRuntime {
          whenShow;
          pageCondition;
          pages;
          timeDelay;
          pageScroll;
          exitIntent;
          frequency;
          lastShowDate;
          productTags;
          showCallback;
          startDate;
          timerRef;
          constructor(dataset, lastShowDate, show) {
            (this.showCallback = show),
              (this.pageCondition = dataset.pageCondition ?? "all"),
              (this.whenShow = dataset.whenShow ?? "immediately"),
              (this.pages = dataset.pages),
              (this.timeDelay =
                dataset.timeDelay === "none" ? null : dataset.timeDelay),
              (this.pageScroll =
                dataset.pageScroll === "none" ? null : dataset.pageScroll),
              (this.exitIntent = dataset.exitIntent === "true"),
              (this.frequency = dataset.frequency ?? "unlimited"),
              (this.productTags = (dataset.productTags || "")
                .split(",")
                .map(clearTag)
                .filter((str) => str.length > 0)),
              (this.lastShowDate = lastShowDate);
          }
          _shouldShowOnThisPage = () => {
            if (this.pageCondition === "target") {
              const urls =
                this.pages
                  ?.split(
                    `
`
                  )
                  .map((sourceUrl) => {
                    try {
                      return new URL(sourceUrl);
                    } catch {
                      return !1;
                    }
                  })
                  .filter(Boolean)
                  .map((url) => url.pathname) ?? [];
              for (let i = 0; i < urls.length; i++) {
                const wildcard = urls[i];
                if (
                  (0, utils_1.wildcardToRegExp)(wildcard).test(
                    window.location.pathname
                  )
                )
                  return !0;
              }
              return !1;
            }
            if (this.pageCondition === "tags") {
              const currentProductTags = window.auroraProductTags;
              return !currentProductTags ||
                !Array.isArray(currentProductTags) ||
                currentProductTags.length === 0
                ? !1
                : currentProductTags
                    .map(clearTag)
                    .some((tag) => this.productTags.includes(tag));
            }
            return !0;
          };
          run = () => {
            this._shouldShowOnThisPage() &&
              ((this.frequency === "once" && this.lastShowDate) ||
                (this.frequency !== "unlimited" &&
                  this.lastShowDate &&
                  Date.now() - frequencyToMs(this.frequency) <
                    this.lastShowDate.getTime()) ||
                ((this.startDate = new Date()),
                (this.timerRef = window.setInterval(() => {
                  this._tick();
                }, 1e3)),
                this._tick(),
                this.exitIntent &&
                  !(0, check_media_1.isMobile)() &&
                  document.addEventListener("mouseout", this._handleMouseLeave),
                this.pageScroll &&
                  (window.addEventListener("scroll", this._handleWindowScroll),
                  this._handleWindowScroll())));
          };
          _tick = () => {
            if (this.whenShow === "immediately") {
              this._show();
              return;
            }
            this.timeDelay &&
              Date.now() - timeDelayToMs(this.timeDelay) >=
                this.startDate.getTime() &&
              this._show();
          };
          _handleWindowScroll = () => {
            const scrollTop = window.scrollY,
              docHeight = document.body.offsetHeight,
              winHeight = window.innerHeight,
              scrollPercent =
                docHeight === winHeight
                  ? 1
                  : scrollTop / (docHeight - winHeight);
            Math.round(scrollPercent * 100) >=
              SCROLL_THRESHOLD[this.pageScroll] && this._show();
          };
          _handleMouseLeave = (e) => {
            !e.toElement && !e.relatedTarget && this._show();
          };
          _show = () => {
            this.showCallback(), this.cleanup();
          };
          cleanup = () => {
            clearInterval(this.timerRef),
              this.pageScroll &&
                window.removeEventListener("scroll", this._handleWindowScroll),
              this.exitIntent &&
                !(0, check_media_1.isMobile)() &&
                document.removeEventListener(
                  "mouseout",
                  this._handleMouseLeave
                );
          };
        }
        exports.ConditionRuntime = ConditionRuntime;
      },
      8126: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.POPUP_CLASSNAMES = exports.POPUP_STORAGE_KEY = void 0),
          (exports.POPUP_STORAGE_KEY = "AuroraTheme-Popup"),
          (exports.POPUP_CLASSNAMES = {
            lightboxActive: "popup--active",
            lightboxClosing: "popup--closing",
            success: "popup--success",
            showImage: "popup--show-image",
          });
      },
      4997: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PopupTeaser =
            exports.PopupSignup =
            exports.PopupPromo =
            exports.PopupAgeVerifier =
              void 0);
        var popup_age_verifier_1 = __webpack_require__2(2677);
        Object.defineProperty(exports, "PopupAgeVerifier", {
          enumerable: !0,
          get: function () {
            return popup_age_verifier_1.PopupAgeVerifier;
          },
        });
        var popup_promo_1 = __webpack_require__2(4156);
        Object.defineProperty(exports, "PopupPromo", {
          enumerable: !0,
          get: function () {
            return popup_promo_1.PopupPromo;
          },
        });
        var popup_signup_1 = __webpack_require__2(9379);
        Object.defineProperty(exports, "PopupSignup", {
          enumerable: !0,
          get: function () {
            return popup_signup_1.PopupSignup;
          },
        });
        var popup_teaser_1 = __webpack_require__2(5520);
        Object.defineProperty(exports, "PopupTeaser", {
          enumerable: !0,
          get: function () {
            return popup_teaser_1.PopupTeaser;
          },
        });
      },
      2677: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PopupAgeVerifier = void 0);
        const modal_1 = __webpack_require__2(2549),
          popup_storage_1 = __webpack_require__2(9625),
          types_1 = __webpack_require__2(8231),
          utils_1 = __webpack_require__2(4142),
          condition_runtime_1 = __webpack_require__2(6502),
          constants_1 = __webpack_require__2(8126),
          check_media_1 = __webpack_require__2(5580),
          utils_2 = __webpack_require__2(4083),
          BODY_ELEMENT_SELECTOR = "body-element";
        class PopupAgeVerifier extends modal_1.ModalComponent {
          storage;
          conditionRuntime;
          hasImage;
          hideImgOnMobile;
          constructor() {
            super(),
              (this.storage = new popup_storage_1.PopupStorage(
                this.dataset.blockId ?? this.id
              )),
              (this.hasImage = this.dataset.hasImage === "true"),
              (this.hideImgOnMobile = this.dataset.hideImgMobile === "true");
          }
          mountComponent() {
            const data = this.storage.loadData();
            if (this.isEditor) {
              this.editor.on("BLOCK_SELECT", this._handleBlockSelect),
                this.editor.on("BLOCK_DESELECT", this._handleBlockDeselect);
              return;
            }
            (!data ||
              (data.type === types_1.PopupType.AgeVerifier &&
                !data.verified)) &&
              ((this.conditionRuntime =
                new condition_runtime_1.ConditionRuntime(
                  this.dataset,
                  null,
                  this.show
                )),
              this.conditionRuntime.run());
          }
          unmountComponent() {
            this.conditionRuntime?.cleanup();
          }
          _handleBlockSelect = ({ detail: { blockId } }) => {
            this.dataset.blockId === blockId && this.show();
          };
          _handleBlockDeselect = ({ detail: { blockId } }) => {
            this.dataset.blockId === blockId && this.hide();
          };
          show = async () => {
            const withGradient = !!this.dataset.overlayGradient,
              bodyElement = (0, utils_2.$el)(BODY_ELEMENT_SELECTOR),
              background = withGradient
                ? (0, utils_1.gradientOpacify)(
                    this.dataset.overlayGradient,
                    this.dataset.overlayOpacity
                  )
                : `color-mix(in srgb, ${this.dataset.overlaySolid} ${
                    Number(this.dataset.overlayOpacity) * 100
                  }%, transparent)`,
              blurFilter = `blur(${this.dataset.overlayBlur}px)`;
            if (
              ((0, utils_2.whenDefined)("body-element").then(() => {
                bodyElement.showOverlay(this.id, {
                  zIndex: 8888,
                  background,
                  backdropFilter: blurFilter,
                  "-webkit-backdrop-filter": blurFilter,
                  transitionDuration: "0s",
                });
              }),
              await super.show(),
              this.classList.add(constants_1.POPUP_CLASSNAMES.lightboxActive),
              this.hasImage)
            ) {
              if (this.hideImgOnMobile && (0, check_media_1.isMobile)()) return;
              setTimeout(() => {
                this.classList.add(constants_1.POPUP_CLASSNAMES.showImage);
              }, utils_1.POPUP_ANIMATION_DELAY);
            }
            this.addListener(this._verifyBtn, "click", this.onVerify);
          };
          hide = async () => {
            const bodyElement = (0, utils_2.$el)(BODY_ELEMENT_SELECTOR);
            (0, utils_2.whenDefined)("body-element").then(() => {
              bodyElement.hideOverlay(this.id);
            }),
              this.conditionRuntime?.cleanup(),
              this.classList.remove(
                constants_1.POPUP_CLASSNAMES.lightboxActive
              ),
              this.classList.add(constants_1.POPUP_CLASSNAMES.lightboxClosing),
              await super.hide(),
              this.classList.remove(constants_1.POPUP_CLASSNAMES.showImage),
              this.classList.remove(
                constants_1.POPUP_CLASSNAMES.lightboxClosing
              );
          };
          onVerify = () => {
            this.isEditor ||
              this.storage.saveData({
                type: types_1.PopupType.AgeVerifier,
                verified: !0,
              }),
              this.removeListener(this._verifyBtn, "click", this.onVerify),
              this.hide();
          };
          get _verifyBtn() {
            return this.isOpen
              ? (0, utils_2.$el)("[data-verify-btn]", this)
              : null;
          }
        }
        exports.PopupAgeVerifier = PopupAgeVerifier;
      },
      4156: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PopupPromo = void 0);
        const modal_1 = __webpack_require__2(2549),
          popup_storage_1 = __webpack_require__2(9625),
          types_1 = __webpack_require__2(8231),
          condition_runtime_1 = __webpack_require__2(6502),
          utils_1 = __webpack_require__2(4142),
          constants_1 = __webpack_require__2(8126),
          check_media_1 = __webpack_require__2(5580),
          utils_2 = __webpack_require__2(4083),
          BODY_ELEMENT_SELECTOR = "body-element";
        class PopupPromo extends modal_1.ModalComponent {
          storage;
          conditionRuntime;
          variant;
          hasImage;
          hideImgOnMobile;
          constructor() {
            super(),
              (this.storage = new popup_storage_1.PopupStorage(
                this.dataset.blockId ?? this.id
              )),
              (this.variant = this.dataset.variant),
              (this.hasImage = this.dataset.hasImage === "true"),
              (this.hideImgOnMobile = this.dataset.hideImgMobile === "true");
          }
          mountComponent() {
            if (this.isEditor) {
              this.editor.on("BLOCK_SELECT", this._handleBlockSelect),
                this.editor.on("BLOCK_DESELECT", this._handleBlockDeselect);
              return;
            }
            const data = this.storage.loadData();
            if (!data || data.type === types_1.PopupType.Promo) {
              if (data?.lastShow)
                try {
                  data.lastShow = new Date(data.lastShow);
                } catch {
                  data.lastShow = null;
                }
              (this.conditionRuntime = new condition_runtime_1.ConditionRuntime(
                this.dataset,
                data?.lastShow ?? null,
                this.show
              )),
                this.conditionRuntime.run();
            }
          }
          unmountComponent() {
            this.conditionRuntime?.cleanup();
          }
          _handleBlockSelect = ({ detail: { blockId } }) => {
            this.dataset.blockId === blockId && this.show();
          };
          _handleBlockDeselect = ({ detail: { blockId } }) => {
            this.dataset.blockId === blockId && this.hide();
          };
          show = async () => {
            if (this.variant === "lightbox") {
              const withGradient = !!this.dataset.overlayGradient,
                bodyElement = (0, utils_2.$el)(BODY_ELEMENT_SELECTOR),
                background = withGradient
                  ? (0, utils_1.gradientOpacify)(
                      this.dataset.overlayGradient,
                      this.dataset.overlayOpacity
                    )
                  : `color-mix(in srgb, ${this.dataset.overlaySolid} ${
                      Number(this.dataset.overlayOpacity) * 100
                    }%, transparent)`,
                blurFilter = `blur(${this.dataset.overlayBlur}px)`;
              (0, utils_2.whenDefined)("body-element").then(() => {
                bodyElement.showOverlay(this.id, {
                  zIndex: 8888,
                  background,
                  backdropFilter: blurFilter,
                  "-webkit-backdrop-filter": blurFilter,
                  transitionDuration: `${utils_1.POPUP_ANIMATION_DELAY}ms`,
                });
              });
            }
            this.emit("popupShown", {}),
              await super.show(),
              this.variant === "lightbox" &&
                this.classList.add(constants_1.POPUP_CLASSNAMES.lightboxActive),
              this.hasImage &&
                !(this.hideImgOnMobile && (0, check_media_1.isMobile)()) &&
                setTimeout(() => {
                  this.classList.add(constants_1.POPUP_CLASSNAMES.showImage);
                }, utils_1.POPUP_ANIMATION_DELAY);
            const closeBtn = this.selectBtn("close-small");
            closeBtn && (closeBtn.style.display = "flex"),
              this.addListener(this.selectBtn("close"), "click", this.hide),
              this.addListener(
                this.selectBtn("close-small"),
                "click",
                this.hide
              ),
              this.addListener(this.selectBtn("promo"), "click", this.onTouch);
          };
          hide = async () => {
            if ((this.onTouch(), this.variant === "lightbox")) {
              const bodyElement = (0, utils_2.$el)(BODY_ELEMENT_SELECTOR);
              (0, utils_2.whenDefined)("body-element").then(() => {
                bodyElement.hideOverlay(this.id);
              });
            }
            this.conditionRuntime?.cleanup(),
              this.removeListener(this.selectBtn("close"), "click", this.hide),
              this.removeListener(
                this.selectBtn("close-small"),
                "click",
                this.hide
              ),
              this.removeListener(
                this.selectBtn("promo"),
                "click",
                this.onTouch
              ),
              this.variant === "lightbox" &&
                (this.classList.remove(
                  constants_1.POPUP_CLASSNAMES.lightboxActive
                ),
                this.classList.add(
                  constants_1.POPUP_CLASSNAMES.lightboxClosing
                )),
              await super.hide(),
              this.classList.remove(constants_1.POPUP_CLASSNAMES.showImage),
              this.classList.remove(
                constants_1.POPUP_CLASSNAMES.lightboxClosing
              ),
              this.emit("popupHidden", {});
          };
          onTouch = () => {
            this.storage.saveData({
              type: types_1.PopupType.Promo,
              lastShow: new Date(),
            });
          };
          selectBtn(type) {
            return this.isOpen
              ? (0, utils_2.$el)(`[data-${type}-btn]`, this)
              : null;
          }
        }
        exports.PopupPromo = PopupPromo;
      },
      9379: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PopupSignup = void 0);
        const modal_1 = __webpack_require__2(2549),
          popup_storage_1 = __webpack_require__2(9625),
          types_1 = __webpack_require__2(8231),
          condition_runtime_1 = __webpack_require__2(6502),
          utils_1 = __webpack_require__2(4142),
          constants_1 = __webpack_require__2(8126),
          check_media_1 = __webpack_require__2(5580),
          utils_2 = __webpack_require__2(4083),
          BODY_ELEMENT_SELECTOR = "body-element";
        class PopupSignup extends modal_1.ModalComponent {
          storage;
          conditionRuntime;
          variant;
          hasImage;
          hideImgOnMobile;
          isSuccessMessage = !1;
          signupCheckbox;
          submitButton;
          constructor() {
            super(),
              (this.storage = new popup_storage_1.PopupStorage(
                this.dataset.blockId ?? this.id
              )),
              (this.variant = this.dataset.variant),
              (this.hasImage = this.dataset.hasImage === "true"),
              (this.hideImgOnMobile = this.dataset.hideImgMobile === "true");
          }
          mountComponent() {
            if (this.isEditor) {
              this.editor.on("BLOCK_SELECT", this._handleBlockSelect),
                this.editor.on("BLOCK_DESELECT", this._handleBlockDeselect);
              return;
            }
            const data = this.storage.loadData();
            if (!window.location.pathname.includes("challenge")) {
              if (
                this.dataset.showSuccessMessage === "true" &&
                window.sessionStorage.getItem("customer-posted-block-id") ===
                  this.dataset.blockId
              ) {
                this.show(),
                  window.sessionStorage.removeItem("customer-posted-block-id"),
                  this.classList.add(constants_1.POPUP_CLASSNAMES.success),
                  (this.isSuccessMessage = !0);
                return;
              }
              if (!data || data.type === types_1.PopupType.Signup) {
                if (data?.lastShow)
                  try {
                    data.lastShow = new Date(data.lastShow);
                  } catch {
                    data.lastShow = null;
                  }
                (this.conditionRuntime =
                  new condition_runtime_1.ConditionRuntime(
                    this.dataset,
                    data?.lastShow ?? null,
                    this.show
                  )),
                  this.conditionRuntime.run();
              }
            }
          }
          unmountComponent() {
            this.conditionRuntime?.cleanup();
          }
          handleSignupCheckboxToggle = ({ currentTarget }) => {
            this.submitButton.toggleAttribute(
              "disabled",
              !currentTarget.checked
            );
          };
          _handleBlockSelect = ({ detail: { blockId } }) => {
            this.dataset.blockId === blockId && this.show();
          };
          _handleBlockDeselect = ({ detail: { blockId } }) => {
            this.dataset.blockId === blockId && this.hide();
          };
          show = async () => {
            if (this.variant === "lightbox") {
              const withGradient = !!this.dataset.overlayGradient,
                bodyElement = (0, utils_2.$el)(BODY_ELEMENT_SELECTOR),
                background = withGradient
                  ? (0, utils_1.gradientOpacify)(
                      this.dataset.overlayGradient,
                      this.dataset.overlayOpacity
                    )
                  : `color-mix(in srgb, ${this.dataset.overlaySolid} ${
                      Number(this.dataset.overlayOpacity) * 100
                    }%, transparent)`,
                blurFilter = `blur(${this.dataset.overlayBlur}px)`;
              (0, utils_2.whenDefined)("body-element").then(() => {
                bodyElement.showOverlay(this.id, {
                  zIndex: 8888,
                  background,
                  backdropFilter: blurFilter,
                  "-webkit-backdrop-filter": blurFilter,
                  transitionDuration: `${utils_1.POPUP_ANIMATION_DELAY}ms`,
                });
              });
            }
            this.emit("popupShown", {}),
              await super.show(),
              this.saveLastShowData();
            const closeBtn = this.selectBtn("close-small");
            if (
              (closeBtn && (closeBtn.style.display = "flex"),
              this.addListener(this.selectBtn("close"), "click", this.hide),
              this.addListener(
                this.selectBtn("close-small"),
                "click",
                this.hide
              ),
              this.addListener(
                this.selectBtn("submit"),
                "click",
                this.onSubmit
              ),
              this.variant === "lightbox" &&
                this.classList.add(constants_1.POPUP_CLASSNAMES.lightboxActive),
              this.hasImage)
            ) {
              if (
                (this.hideImgOnMobile && (0, check_media_1.isMobile)()) ||
                this.isSuccessMessage
              )
                return;
              setTimeout(() => {
                this.classList.add(constants_1.POPUP_CLASSNAMES.showImage);
              }, utils_1.POPUP_ANIMATION_DELAY);
            }
          };
          hide = async () => {
            if ((this.saveLastShowData(), this.variant === "lightbox")) {
              const bodyElement = (0, utils_2.$el)(BODY_ELEMENT_SELECTOR);
              (0, utils_2.whenDefined)("body-element").then(() => {
                bodyElement.hideOverlay(this.id);
              });
            }
            this.conditionRuntime?.cleanup(),
              this.removeListener(this.selectBtn("close"), "click", this.hide),
              this.removeListener(
                this.selectBtn("close-small"),
                "click",
                this.hide
              ),
              this.removeListener(
                this.selectBtn("submit"),
                "click",
                this.onSubmit
              ),
              this.variant === "lightbox" &&
                (this.classList.remove(
                  constants_1.POPUP_CLASSNAMES.lightboxActive
                ),
                this.classList.add(
                  constants_1.POPUP_CLASSNAMES.lightboxClosing
                )),
              await super.hide(),
              this.classList.remove(constants_1.POPUP_CLASSNAMES.showImage),
              this.classList.remove(
                constants_1.POPUP_CLASSNAMES.lightboxClosing
              ),
              this.emit("popupHidden", {});
          };
          onSubmit = () => {
            window.sessionStorage.setItem(
              "customer-posted-block-id",
              this.dataset.blockId
            );
          };
          saveLastShowData = () => {
            this.storage.saveData({
              type: types_1.PopupType.Signup,
              lastShow: new Date(),
            });
          };
          selectBtn(type) {
            return this.isOpen
              ? (0, utils_2.$el)(`[data-${type}-btn]`, this)
              : null;
          }
        }
        exports.PopupSignup = PopupSignup;
      },
      9625: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PopupStorage = void 0);
        const constants_1 = __webpack_require__2(8126);
        class PopupStorage {
          _blockId;
          constructor(blockId) {
            this._blockId = blockId;
          }
          parseData(data) {
            if (!data) return null;
            try {
              return JSON.parse(data ?? "{}");
            } catch {
              return null;
            }
          }
          saveData(data) {
            try {
              localStorage.setItem(
                `${constants_1.POPUP_STORAGE_KEY}-${this._blockId}`,
                JSON.stringify(data)
              );
            } catch {}
          }
          loadData() {
            try {
              return this.parseData(
                localStorage.getItem(
                  `${constants_1.POPUP_STORAGE_KEY}-${this._blockId}`
                )
              );
            } catch {
              return null;
            }
          }
        }
        exports.PopupStorage = PopupStorage;
      },
      5520: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PopupTeaser = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          check_media_1 = __webpack_require__2(5580),
          TARGET_POPUP_ATTRIBUTE = "data-target-popup-id",
          CAN_BE_CLOSED_ATTRIBUTE = "data-can-be-closed-on",
          CLOSE_BTN_SELECTOR = "[data-popup-teaser-close]",
          ANIMATION_OPTIONS = {
            duration: 750,
            easing: "ease-in-out",
            fill: "forwards",
          };
        class PopupTeaser extends base_component_1.BaseComponent {
          targetPopup;
          canBeClosedOn;
          removePermanently;
          mountComponent() {
            (this.removePermanently = !1),
              (this.canBeClosedOn = this.getAttribute(CAN_BE_CLOSED_ATTRIBUTE)),
              (this.targetPopup = (0, utils_1.$el)(
                `[data-block-id="${this.getAttribute(
                  TARGET_POPUP_ATTRIBUTE
                )}"]`,
                this.parentElement
              )),
              this.addListener(this, "click", this.handleTeaserClick),
              this.targetPopup.on("popupHidden", this.showTeaser),
              this.targetPopup.on("popupShown", this.hideTeaser),
              this.isEditor &&
                (this.editor.on("BLOCK_SELECT", this.handleBlockSelect),
                this.editor.on("BLOCK_DESELECT", this.handleBlockDeselect));
          }
          unmountComponent() {
            this.removeListener(this, "click", this.handleTeaserClick),
              this.targetPopup.off("popupHidden", this.showTeaser),
              this.targetPopup.off("popupShown", this.hideTeaser),
              this.isEditor &&
                (this.editor.off("BLOCK_SELECT", this.handleBlockSelect),
                this.editor.off("BLOCK_DESELECT", this.handleBlockDeselect));
          }
          showTeaser = async () => {
            await this.animate(
              { [this.getTeaserPosition()]: "0" },
              ANIMATION_OPTIONS
            ).finished;
          };
          hideTeaser = async () => {
            await this.animate(
              { [this.getTeaserPosition()]: "-50%" },
              ANIMATION_OPTIONS
            ).finished,
              this.removePermanently && this.remove();
          };
          getTeaserPosition = () => {
            const { left, right } = getComputedStyle(this),
              isLeft = parseInt(left) < 1,
              isRight = parseInt(right) < 1;
            return isLeft ? "left" : isRight ? "right" : "bottom";
          };
          handleTeaserClick = ({ target }) => {
            target.closest(CLOSE_BTN_SELECTOR)
              ? ((this.removePermanently = !0), this.hideTeaser())
              : this.showPopup();
          };
          showPopup = () => {
            this.targetPopup.show();
            const isNowMobile = (0, check_media_1.isMobile)();
            (this.removePermanently =
              (isNowMobile && !this.canBeClosedOn?.includes("mobile")) ||
              (!isNowMobile && !this.canBeClosedOn?.includes("desktop"))),
              this.hideTeaser();
          };
          handleBlockSelect = ({ detail: { blockId } }) => {
            this.dataset.targetPopupId === blockId &&
              ((this.style.zIndex = "10001"), this.showTeaser());
          };
          handleBlockDeselect = ({ detail: { blockId } }) => {
            this.dataset.targetPopupId === blockId &&
              (this.hideTeaser(), this.removeAttribute("style"));
          };
        }
        exports.PopupTeaser = PopupTeaser;
      },
      8231: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PopupType = void 0);
        var PopupType;
        (function (PopupType2) {
          (PopupType2.AgeVerifier = "age"),
            (PopupType2.Promo = "promo"),
            (PopupType2.Signup = "signup");
        })(PopupType || (exports.PopupType = PopupType = {}));
      },
      4142: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.gradientOpacify =
            exports.wildcardToRegExp =
            exports.POPUP_ANIMATION_DELAY =
              void 0),
          (exports.POPUP_ANIMATION_DELAY = 750);
        const wildcardToRegExp = (wildcardPattern, flags) => {
          const regexMatch = /^\/(.+)\/([im]+)?$/.exec(wildcardPattern);
          if (regexMatch)
            return new RegExp(regexMatch[1], regexMatch[2] || flags);
          const pattern = wildcardPattern
            .replace(/[\-\[\]\/{}()?.\\^$|]/g, "\\$&")
            .replace(/\*/g, ".*?")
            .replace(/\+/g, ".+?");
          return new RegExp(`^${pattern}$`, flags);
        };
        exports.wildcardToRegExp = wildcardToRegExp;
        const gradientOpacify = (gradient, opacity) => {
          try {
            return (
              gradient.match(/rgba\([^()]*\)|#\w+/g)?.forEach((color) => {
                const [r, g, b, a] = color
                    .split("(")[1]
                    .split(")")[0]
                    .split(",")
                    .map((c) => c.trim()),
                  alpha = +a * +opacity;
                gradient = gradient.replace(
                  color,
                  `rgba(${r}, ${g}, ${b}, ${Math.round(alpha * 100) / 100})`
                );
              }),
              gradient
            );
          } catch {
            return gradient;
          }
        };
        exports.gradientOpacify = gradientOpacify;
      },
      6368: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductRecommendations = void 0);
        var product_recommendations_1 = __webpack_require__2(7329);
        Object.defineProperty(exports, "ProductRecommendations", {
          enumerable: !0,
          get: function () {
            return product_recommendations_1.ProductRecommendations;
          },
        });
      },
      7329: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductRecommendations = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889);
        class ProductRecommendations extends base_component_1.BaseComponent {
          mountComponent() {
            this.update();
          }
          update = () => {
            const url = this.dataset.url;
            url &&
              fetch(url)
                .then((response) => response.text())
                .then((text) => {
                  this.updateByHTML((0, dom_1.parseHTML)(text));
                })
                .catch(() => {
                  console.log("Error in product recommendations component");
                });
          };
          updateByHTML(html) {
            const recommendations = (0, utils_1.$el)(
              `product-recommendations[id="${this.id}"]`,
              html
            );
            (0, dom_1.replaceNodeChildren)(this, recommendations);
          }
        }
        exports.ProductRecommendations = ProductRecommendations;
      },
      9193: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductBlock =
            exports.ProductMediaCarousel =
            exports.ProductMedia =
            exports.ProductInformationDrawer =
            exports.ProductFormButton =
            exports.ProductForm =
            exports.ProductDetails =
            exports.ProductContent =
            exports.ColorSwatchesPicker =
            exports.ProductBreadcrumbs =
            exports.ZoomCursor =
            exports.ProductRelatedBlock =
            exports.RecipientForm =
            exports.QuickView =
            exports.VariantPicker =
            exports.PickupAvailability =
            exports.ProductModalButton =
            exports.ProductModal =
              void 0);
        var product_modal_1 = __webpack_require__2(7327);
        Object.defineProperty(exports, "ProductModal", {
          enumerable: !0,
          get: function () {
            return product_modal_1.ProductModal;
          },
        });
        var product_modal_button_1 = __webpack_require__2(9783);
        Object.defineProperty(exports, "ProductModalButton", {
          enumerable: !0,
          get: function () {
            return product_modal_button_1.ProductModalButton;
          },
        });
        var product_pickup_availability_1 = __webpack_require__2(250);
        Object.defineProperty(exports, "PickupAvailability", {
          enumerable: !0,
          get: function () {
            return product_pickup_availability_1.PickupAvailability;
          },
        });
        var product_variant_picker_1 = __webpack_require__2(453);
        Object.defineProperty(exports, "VariantPicker", {
          enumerable: !0,
          get: function () {
            return product_variant_picker_1.VariantPicker;
          },
        });
        var quick_view_1 = __webpack_require__2(4218);
        Object.defineProperty(exports, "QuickView", {
          enumerable: !0,
          get: function () {
            return quick_view_1.QuickView;
          },
        });
        var recipient_form_1 = __webpack_require__2(1893);
        Object.defineProperty(exports, "RecipientForm", {
          enumerable: !0,
          get: function () {
            return recipient_form_1.RecipientForm;
          },
        });
        var related_products_block_1 = __webpack_require__2(9129);
        Object.defineProperty(exports, "ProductRelatedBlock", {
          enumerable: !0,
          get: function () {
            return related_products_block_1.ProductRelatedBlock;
          },
        });
        var zoom_cursor_1 = __webpack_require__2(9220);
        Object.defineProperty(exports, "ZoomCursor", {
          enumerable: !0,
          get: function () {
            return zoom_cursor_1.ZoomCursor;
          },
        });
        var product_breadcrumbs_1 = __webpack_require__2(9180);
        Object.defineProperty(exports, "ProductBreadcrumbs", {
          enumerable: !0,
          get: function () {
            return product_breadcrumbs_1.ProductBreadcrumbs;
          },
        });
        var product_color_swatches_1 = __webpack_require__2(6628);
        Object.defineProperty(exports, "ColorSwatchesPicker", {
          enumerable: !0,
          get: function () {
            return product_color_swatches_1.ColorSwatchesPicker;
          },
        });
        var product_content_1 = __webpack_require__2(5044);
        Object.defineProperty(exports, "ProductContent", {
          enumerable: !0,
          get: function () {
            return product_content_1.ProductContent;
          },
        });
        var product_details_1 = __webpack_require__2(5104);
        Object.defineProperty(exports, "ProductDetails", {
          enumerable: !0,
          get: function () {
            return product_details_1.ProductDetails;
          },
        });
        var product_form_1 = __webpack_require__2(7048);
        Object.defineProperty(exports, "ProductForm", {
          enumerable: !0,
          get: function () {
            return product_form_1.ProductForm;
          },
        });
        var product_form_button_1 = __webpack_require__2(4742);
        Object.defineProperty(exports, "ProductFormButton", {
          enumerable: !0,
          get: function () {
            return product_form_button_1.ProductFormButton;
          },
        });
        var product_information_drawer_1 = __webpack_require__2(8272);
        Object.defineProperty(exports, "ProductInformationDrawer", {
          enumerable: !0,
          get: function () {
            return product_information_drawer_1.ProductInformationDrawer;
          },
        });
        var product_media_1 = __webpack_require__2(3313);
        Object.defineProperty(exports, "ProductMedia", {
          enumerable: !0,
          get: function () {
            return product_media_1.ProductMedia;
          },
        });
        var product_media_carousel_1 = __webpack_require__2(2822);
        Object.defineProperty(exports, "ProductMediaCarousel", {
          enumerable: !0,
          get: function () {
            return product_media_carousel_1.ProductMediaCarousel;
          },
        });
        var product_block_1 = __webpack_require__2(2569);
        Object.defineProperty(exports, "ProductBlock", {
          enumerable: !0,
          get: function () {
            return product_block_1.ProductBlock;
          },
        });
      },
      2569: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductBlock = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          CONTAINER_SELECTOR = "[data-product-block-container]";
        class ProductBlock extends base_component_1.BaseComponent {
          updateByVariantId(variantId) {
            const node = (0, utils_1.$el)(CONTAINER_SELECTOR, this),
              newNode = (0, dom_1.getTemplateContent)(
                (0, utils_1.$el)(
                  `[data-product-block-template="${variantId}"]`,
                  this
                )
              );
            (0, dom_1.replaceNodeChildren)(node, newNode);
          }
        }
        exports.ProductBlock = ProductBlock;
      },
      9180: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductBreadcrumbs = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          COLLECTION_LINK_SELECTOR = "[data-collection-link]";
        class ProductBreadcrumbs extends base_component_1.BaseComponent {
          setCollectionPage = (collectionPage) => {
            if (collectionPage) {
              const link = (0, utils_1.$el)(COLLECTION_LINK_SELECTOR, this);
              if (link) {
                const data = JSON.parse(collectionPage);
                (link.href = data.url),
                  (link.ariaLabel = data.title),
                  (link.textContent = data.title);
              }
            }
          };
        }
        exports.ProductBreadcrumbs = ProductBreadcrumbs;
      },
      6628: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ColorSwatchesPicker = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          ACTIVE_VALUE_SELECTOR = "[data-color-swatches-picker-active-value]",
          LABEL_SELECTOR = "[data-color-swatches-picker-label]";
        class ColorSwatchesPicker extends base_component_1.BaseComponent {
          mountComponent() {
            const labels = (0, utils_1.$list)(LABEL_SELECTOR, this),
              form = (0, utils_1.$elParent)("variant-picker", this)?.getForm();
            form && this.addListener(form, "change", this.handleFormChange),
              labels.forEach((label) => {
                this.addListener(label, "mouseenter", this.handleMouseEnter),
                  this.addListener(label, "mouseleave", this.handleMouseLeave);
              });
          }
          handleFormChange = () => {
            this.setSelected();
          };
          handleMouseEnter = (event) => {
            event.preventDefault();
            const target = event.target;
            this.setHovered(target.dataset.value);
          };
          handleMouseLeave = (event) => {
            event.preventDefault(), this.setSelected();
          };
          setSelected() {
            const swatch = (0, utils_1.$el)(`${LABEL_SELECTOR}.selected`, this);
            this.setHovered(swatch?.getAttribute("data-value") || "");
          }
          setHovered(value) {
            const label = (0, utils_1.$el)(ACTIVE_VALUE_SELECTOR, this);
            label && (label.textContent = value);
          }
        }
        exports.ColorSwatchesPicker = ColorSwatchesPicker;
      },
      5044: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductContent = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          check_media_1 = __webpack_require__2(5580);
        class ProductContent extends base_component_1.BaseComponent {
          variantPickerSelector;
          containerAttribute;
          visibleClass;
          mobileClass;
          variantPicker;
          variant;
          desktopContent;
          mobileContent;
          desktopContainers;
          mobileContainers;
          carousels;
          dots;
          modal;
          initialImagesQuantity;
          currentImagesQuantity;
          modalQuantityElement;
          isMobile;
          carouselImages;
          dotsImages;
          gridImages;
          modalImages;
          desktopImages;
          mobileImages;
          currentContainers;
          currentImages;
          currentDots;
          resizeObserver;
          constructor() {
            super(),
              (this.variantPickerSelector = "variant-picker"),
              (this.containerAttribute = "data-container"),
              (this.visibleClass = "product__image-visible"),
              (this.variantPicker = this.querySelector(
                this.variantPickerSelector
              )),
              (this.desktopContent = this.querySelector(
                "[data-product-desktop-media]"
              )),
              (this.mobileContent = this.querySelector(
                "[data-product-mobile-media]"
              )),
              (this.desktopContainers = [
                ...this.desktopContent.querySelectorAll(
                  `[${this.containerAttribute}]`
                ),
              ]),
              (this.mobileContainers = [
                ...this.mobileContent.querySelectorAll(
                  `[${this.containerAttribute}]`
                ),
              ]),
              (this.dots = [...this.querySelectorAll("carousel-dots")]),
              (this.carousels = [
                ...this.querySelectorAll("carousel-component, carousel-dots"),
              ]),
              (this.modal =
                this.querySelector("product-modal") ??
                this.parentElement.querySelector("product-modal")),
              (this.isMobile = (0, check_media_1.isMobile)()),
              (this.initialImagesQuantity = null),
              (this.currentImagesQuantity = null),
              (this.resizeObserver = new ResizeObserver(this.handleResize)),
              this.resizeObserver.observe(this);
          }
          connectedCallback() {
            this.init();
          }
          disconnectedCallback() {
            this.variantPicker.off("change", this.handleVariantChange);
          }
          init = () => {
            Promise.all([
              (0, utils_1.whenDefined)("product-modal"),
              (0, utils_1.whenDefined)("variant-picker"),
            ])
              .then(() => {
                if (this.modal?.element) {
                  const container = (0, utils_1.$el)(
                    `[${this.containerAttribute}]`,
                    this.modal.element
                  );
                  this.mobileContainers.push(container),
                    this.desktopContainers.push(container),
                    (this.modalQuantityElement =
                      this.modal.element.querySelector(
                        "[data-product-modal-slides-total]"
                      ));
                }
                (this.desktopImages = this.assignImages(
                  this.desktopContainers
                )),
                  (this.mobileImages = this.assignImages(
                    this.mobileContainers
                  )),
                  this.setCurrentContainers(),
                  this.setInitialImagesLength(),
                  this.handleVariantChange({
                    variant: this.variantPicker.variant,
                  }),
                  this.variantPicker.on("change", this.handleVariantChange);
              })
              .catch((error) => {
                console.log(error);
              });
          };
          handleVariantChange = ({ variant }) => {
            this.currentContainers.forEach((container) => {
              switch (container.dataset.container) {
                case "carousel":
                  this.replaceCarouselSlides(container);
                  break;
                case "dots":
                  this.replaceDotsSlides(container);
                  break;
                case "grid":
                  this.replaceGridSlides(container);
                  break;
                case "modal":
                  this.replaceModalSlides(container);
                  break;
                default:
                  break;
              }
            }),
              this.reInitCarousels(),
              this.scrollToVariant(variant),
              this.modal && this.modal.updateModal(),
              (this.variant = variant);
          };
          replaceCarouselSlides = (container) => {
            const carouselImages = this.getImages(
              this.currentImages.carouselImages
            );
            carouselImages[0].classList.add("is-selected"),
              carouselImages[0].classList.toggle(
                "product-media-carousel-mobile__slide--alone",
                carouselImages.length < 2
              ),
              this.pasteImages(container, carouselImages);
          };
          replaceDotsSlides = (container) => {
            const dotsImages = this.getImages(this.currentImages.dotsImages);
            dotsImages.forEach((img, i) => {
              img.setAttribute("data-dot-index", String(i));
            }),
              this.pasteImages(container, dotsImages);
          };
          replaceGridSlides = (container) => {
            const gridImages = this.getImages(this.currentImages.gridImages);
            this.pasteImages(container, gridImages);
          };
          replaceModalSlides = (container) => {
            if (this.modal) {
              const modalImages = this.getImages(
                this.currentImages.modalImages
              );
              this.pasteImages(container, modalImages),
                (this.modalQuantityElement.textContent = String(
                  modalImages.length
                ));
            }
          };
          getImages = (initialImages) => {
            const images = initialImages.map((el) => el.cloneNode(!0)),
              options = this.dataset.options.split(","),
              filtered = images.filter((img) => {
                const imgVariant = img.dataset.variant;
                if (!imgVariant.includes("#") || !imgVariant.includes("_"))
                  return !1;
                const altPattern = imgVariant
                  .split("#")
                  .find((n) => n.includes("_"));
                if (!altPattern) return !1;
                const splittedPattern = altPattern.split("_"),
                  patternOption = splittedPattern[0],
                  patternValues = splittedPattern[1].split(",");
                return options.some((optionName, index) =>
                  patternOption.toLowerCase() === optionName.toLowerCase()
                    ? patternValues.some(
                        (patternValue) =>
                          patternValue.toLowerCase().trim() ===
                          this.variantPicker.variant.options[
                            index
                          ].toLowerCase()
                      )
                    : !1
                );
              });
            return filtered.length > 0 ? filtered : images;
          };
          pasteImages = (container, images) => {
            container.replaceChildren(...images),
              (this.currentImagesQuantity = images.length);
          };
          reInitCarousels = () => {
            this.carousels.length > 0 &&
              this.carousels.forEach((carousel) => {
                carousel.reInit();
              });
          };
          assignImages = (containers) => {
            const carouselImages = [],
              dotsImages = [],
              gridImages = [],
              modalImages = [];
            return (
              containers.forEach((container) => {
                const children = [...container.cloneNode(!0).children];
                switch (container.dataset.container) {
                  case "carousel":
                    carouselImages.push(...children),
                      carouselImages.forEach((img, i) => {
                        img.classList.remove("is-selected");
                      });
                    break;
                  case "dots":
                    dotsImages.push(...children),
                      dotsImages.forEach((img, i) => {
                        img.classList.remove("is-primary"),
                          img.classList.remove("is-selected"),
                          img.classList.remove("is-in-view"),
                          img.classList.remove("is-snapped"),
                          img.classList.remove("is-prev-prev");
                      });
                    break;
                  case "grid":
                    gridImages.push(...children);
                    break;
                  case "modal":
                    modalImages.push(...children);
                    break;
                  default:
                    break;
                }
              }),
              { carouselImages, dotsImages, gridImages, modalImages }
            );
          };
          scrollToVariant = (variant) => {
            if (
              (this.currentImagesQuantity === this.initialImagesQuantity &&
              variant.featured_media
                ? this.variantPicker.setFirstMediaByVariant(variant)
                : (this.carousels.forEach((carousel) => {
                    carousel.embla.scrollTo(0);
                  }),
                  this.variantPicker.setFirstMediaByVariant(0)),
              this.currentDots)
            ) {
              const dots = [...this.currentDots.embla.slideNodes()],
                selectedDotIndex =
                  this.currentDots.carousel.embla.selectedScrollSnap();
              dots.forEach((dot) => {
                const isSelectedDot =
                  +dot.dataset.dotIndex === selectedDotIndex;
                dot.classList.toggle("is-primary", isSelectedDot);
              });
            }
          };
          setCurrentContainers = () => {
            (this.currentContainers = this.isMobile
              ? this.mobileContainers
              : this.desktopContainers),
              (this.currentImages = this.isMobile
                ? this.mobileImages
                : this.desktopImages),
              (this.currentDots = this.dots.find((el) => el.offsetWidth > 0));
          };
          setInitialImagesLength = () => {
            const isCarouselImages =
              !!this.currentImages.carouselImages?.length;
            this.initialImagesQuantity = isCarouselImages
              ? this.currentImages.carouselImages?.length
              : this.currentImages.gridImages?.length;
          };
          handleResize = () => {
            this.isMobile !== (0, check_media_1.isMobile)() &&
              ((this.isMobile = (0, check_media_1.isMobile)()),
              this.setCurrentContainers());
          };
        }
        exports.ProductContent = ProductContent;
      },
      5104: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductDetails = void 0);
        const base_component_1 = __webpack_require__2(3608),
          check_media_1 = __webpack_require__2(5580),
          utils_1 = __webpack_require__2(4083),
          TABS_COMPONENT_SELECTOR = "tabs-component",
          CAROUSEL_SELECTOR = "carousel-component";
        class ProductDetails extends base_component_1.BaseComponent {
          isMobile = (0, check_media_1.isMobile)();
          resizeObserver;
          activeTab;
          activeTabIndex;
          nextTargetTab;
          lastInnerTarget;
          mountComponent() {
            const tabs = (0, utils_1.$el)(TABS_COMPONENT_SELECTOR, this);
            (this.resizeObserver = new ResizeObserver(this.handleResize)),
              this.resizeObserver.observe(this),
              (0, utils_1.whenDefined)(TABS_COMPONENT_SELECTOR).then(() => {
                tabs?.on("selectTab", this.handleTabSelect);
              });
          }
          unmountComponent() {
            const tabs = (0, utils_1.$el)(TABS_COMPONENT_SELECTOR, this);
            (0, utils_1.whenDefined)(TABS_COMPONENT_SELECTOR).then(() => {
              tabs?.off("selectTab", this.handleTabSelect);
            }),
              this.resizeObserver.disconnect();
          }
          handleTabSelect = ({ tabId, tab }) => {
            (this.activeTab = tab),
              (this.activeTabIndex = +tabId - 1),
              this.scrollToActiveTab();
            const targets = this.getInnerTargets();
            targets.length > 0 && this.setTabContentTargets(targets);
          };
          handleResize = () => {
            (0, check_media_1.isMobile)() !== this.isMobile &&
              (this.isMobile = (0, check_media_1.isMobile)()),
              (0, check_media_1.isMobile)() && this.scrollToActiveTab();
          };
          scrollToActiveTab = () => {
            (0, utils_1.$el)(CAROUSEL_SELECTOR, this)?.embla.scrollTo(
              this.activeTabIndex
            );
          };
          getInnerTargets = () =>
            (0, utils_1.$list)((0, utils_1.getFocusTargets)(), this.activeTab);
          setTabContentTargets = (targets) => {
            const tabs = (0, utils_1.$el)(TABS_COMPONENT_SELECTOR, this)
              .getNames()
              .filter((tab) => tab.offsetWidth > 0);
            (this.nextTargetTab = tabs[this.activeTabIndex + 1] ?? null),
              (this.lastInnerTarget = targets[targets.length - 1]),
              this.addListener(
                this.lastInnerTarget,
                "blur",
                this.handleLastTargetBlur
              ),
              targets[0].focus();
          };
          handleLastTargetBlur = () => {
            this.nextTargetTab.focus(),
              this.removeListener(
                this.lastInnerTarget,
                "blur",
                this.handleLastTargetBlur
              ),
              (this.lastInnerTarget = null),
              (this.nextTargetTab = null);
          };
        }
        exports.ProductDetails = ProductDetails;
      },
      4742: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductFormButton = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          FOOTER_SELECTOR = ".shopify-section.shopify-section-footer",
          FORM_SELECTOR = "product-form";
        class ProductFormButton extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(window, "scroll", this.handleWindowScroll);
          }
          handleWindowScroll = () => {
            const form = (0, utils_1.$elParent)(FORM_SELECTOR, this);
            if (!form) return;
            const footer = (0, utils_1.$el)(FOOTER_SELECTOR),
              point = form.offsetTop + form.offsetHeight,
              footerOffsetTop = footer ? footer.offsetTop : 0,
              isVisible =
                window.innerHeight + window.scrollY < footerOffsetTop &&
                window.scrollY > point;
            this.classList.toggle("is-visible", isVisible),
              document.body.toggleAttribute(
                "is-product-form-button-fixed",
                isVisible
              );
          };
        }
        exports.ProductFormButton = ProductFormButton;
      },
      7048: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductForm = void 0);
        const base_component_1 = __webpack_require__2(3608),
          cart_api_1 = __webpack_require__2(735),
          fetch_config_1 = __webpack_require__2(8548),
          utils_1 = __webpack_require__2(4083),
          dom_1 = __webpack_require__2(3889),
          CART_DRAWER_SELECTOR = "#CartDrawer",
          CART_PAGE_SELECTOR = "cart-page",
          CART_NOTIFICATION_POPUP_SELECTOR = "#CartNotificationPopup",
          FORM_SELECTOR = "form",
          VARIANT_INPUT_SELECTOR = "[data-product-form-variant]",
          QUICK_VIEW = "#Quick-view",
          BODY_ELEMENT_SELECTOR = "body-element";
        class ProductForm extends base_component_1.BaseComponent {
          cartApi = new cart_api_1.CartAPI();
          lastParsedState;
          mountComponent() {
            const form = (0, utils_1.$el)(FORM_SELECTOR, this);
            this.addListener(form, "submit", this.handleFormSubmit);
          }
          handleFormSubmit = async (event) => {
            event.preventDefault();
            const config = this.getQueryConfig();
            this.setDisable(!0),
              this.setLoading(!0),
              await this.cartApi
                .add(config)
                .then((state) => {
                  this.setDisable(!1), this.setLoading(!1), openCartCheckout();
                  const parsedState = JSON.parse(state);
                  if (parsedState.description) {
                    this.showError(parsedState);
                    return;
                  }
                  (this.lastParsedState = parsedState),
                    this.updateCartItems(
                      (0, dom_1.parseHTML)(
                        JSON.parse(state).sections[this.cartId]
                      )
                    );
                })
                .catch(() => console.log("Error in product form component"));
          };
          updateCartItems(html) {
            const cartDrawer = (0, utils_1.$el)(CART_DRAWER_SELECTOR),
              cart = (0, utils_1.$el)(CART_PAGE_SELECTOR),
              popup = (0, utils_1.$el)(CART_NOTIFICATION_POPUP_SELECTOR);
            cart
              ? this.updateCart(html)
              : cartDrawer ||
                (popup ? this.updatePopup(html) : this.updateCartCount(html));
          }
          updateCartCount(html) {
            const newCount = (0, utils_1.$el)("#NewCartCount", html),
              currentCounts = (0, utils_1.$list)("#CartCount");
            this.onUpdateCartItems(() => {
              currentCounts.forEach((currentCount) => {
                (0, dom_1.replaceNodeChildren)(currentCount, newCount);
              });
            });
          }
          updateCart(html) {
            const cart = (0, utils_1.$el)(CART_PAGE_SELECTOR);
            cart?.updateEmptyStatus(!1),
              this.onUpdateCartItems(() => {
                cart?.purchaseHandler(html, this.lastParsedState);
              });
          }
          updateCartDrawer(html) {
            const cartDrawer = (0, utils_1.$el)(CART_DRAWER_SELECTOR);
            cartDrawer?.updateAsideProductsByParsedState(this.lastParsedState),
              cartDrawer?.updateEmptyStatus(),
              this.onUpdateCartItems(() => {
                cartDrawer?.purchaseHandler(html, this.lastParsedState);
              });
          }
          updatePopup(html) {
            this.onUpdateCartItems(() => {
              (0, utils_1.$el)(
                CART_NOTIFICATION_POPUP_SELECTOR
              )?.purchaseHandler(html, this.lastParsedState);
            });
          }
          async onUpdateCartItems(callback) {
            const quickView = (0, utils_1.$el)(QUICK_VIEW);
            quickView.isOpen ? quickView.hide().then(callback) : callback();
          }
          showError(parsedState) {
            const bodyElement = (0, utils_1.$el)(BODY_ELEMENT_SELECTOR),
              error =
                typeof parsedState.description == "object"
                  ? this.getErrorFromObject(parsedState.description)
                  : parsedState.description;
            bodyElement.showNotification(error, "warning");
          }
          getErrorFromObject(errorObject) {
            return Object.keys(errorObject)
              .map((key) => `${key}: ${errorObject[key]}`)
              .join(" , ");
          }
          getQueryConfig() {
            const form = (0, utils_1.$el)(FORM_SELECTOR, this),
              config = (0, fetch_config_1.fetchConfig)("javascript"),
              formData = new FormData(form);
            return (
              (config.headers["X-Requested-With"] = "XMLHttpRequest"),
              delete config.headers["Content-Type"],
              formData.append("sections", [this.cartId]),
              formData.append("sections_url", window.location.pathname),
              (config.body = formData),
              config
            );
          }
          setLoading(isLoading) {
            (0, utils_1.$list)('button[type="submit"]', this).forEach(
              (button) => button.classList.toggle("loading", isLoading)
            );
          }
          setDisable(isDisable) {
            (0, utils_1.$list)('button[type="submit"]', this).forEach(
              (button) => button.toggleAttribute("disabled", isDisable)
            );
          }
          setButtonText(text) {
            (0, utils_1.$list)('button[type="submit"]', this).forEach(
              (button) => (button.textContent = text)
            );
          }
          getVeriantInput() {
            const form = (0, utils_1.$el)(FORM_SELECTOR, this);
            return (0, utils_1.$el)(VARIANT_INPUT_SELECTOR, form);
          }
          get cartId() {
            const cartDrawer = (0, utils_1.$el)(CART_DRAWER_SELECTOR),
              cart = (0, utils_1.$el)(CART_PAGE_SELECTOR);
            return cartDrawer
              ? cartDrawer.dataset.sectionId
              : cart
              ? cart.dataset.sectionId
              : "cart-notification-popup-content";
          }
        }
        exports.ProductForm = ProductForm;
      },
      5089: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductInfo = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          debounce_1 = __webpack_require__2(2731),
          check_media_1 = __webpack_require__2(5580),
          SCROLLTRACK_ATTRIBUTE = "data-with-scrolltrack",
          HEADER_SELECTOR = "header-component",
          SMALL_CLASS = "product__info-wrapper--small",
          WIDE_CLASS = "product__info-wrapper--wide",
          WIDE_PLUS_CLASS = "product__info-wrapper--wide-plus";
        class ProductInfo extends base_component_1.BaseComponent {
          headerHeight;
          defaultTopSpace;
          infoHeight;
          isToSetMoreHeight;
          resizeObserver;
          mountComponent() {
            this.hasAttribute(SCROLLTRACK_ATTRIBUTE) &&
              (customElements.whenDefined("header-component").then(() => {
                this.setDimentions(),
                  this.addListener(window, "scroll", this.handleScroll);
              }),
              this.isEditor &&
                this.editor.on("SECTION_LOAD", this.handleSectionLoad)),
              (this.resizeObserver = new ResizeObserver(this.handleResize)),
              this.resizeObserver.observe(this);
          }
          setDimentions = () => {
            (this.defaultTopSpace = 16),
              (this.infoHeight = this.getBoundingClientRect().height);
            const header = (0, utils_1.$el)(HEADER_SELECTOR),
              headerSection = header.section;
            (this.headerHeight = headerSection.offsetHeight),
              (this.isToSetMoreHeight =
                header.getAttribute("is-sticky") === "static");
          };
          handleScroll = () => {
            const topSpace = this.isToSetMoreHeight
                ? this.defaultTopSpace + this.headerHeight
                : this.defaultTopSpace,
              viewportHeight = window.innerHeight - topSpace;
            window.scrollY > 0 && this.infoHeight > viewportHeight
              ? (this.style.top = `${viewportHeight - this.infoHeight}px`)
              : (this.style.top = `${topSpace}px`);
          };
          handleSectionLoad = () => {
            this.setDimentions();
          };
          handleResize = (0, debounce_1.debounce)(() => {
            (0, check_media_1.isMobile)() || this.toggleWidthClasses();
          }, 50);
          toggleWidthClasses = () => {
            const infoWidth = this.getBoundingClientRect().width;
            this.classList.toggle(SMALL_CLASS, infoWidth < 380),
              this.classList.toggle(WIDE_CLASS, infoWidth > 480),
              this.classList.toggle(WIDE_PLUS_CLASS, infoWidth > 740);
          };
        }
        exports.ProductInfo = ProductInfo;
      },
      8272: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductInformationDrawer = void 0);
        const sidebar_1 = __webpack_require__2(4622),
          utils_1 = __webpack_require__2(4083),
          VIEWPORT_SELECTOR = "[data-product-information-drawer-viewport]";
        class ProductInformationDrawer extends sidebar_1.SidebarComponent {
          mountComponent() {
            super.mountComponent();
            const viewport = (0, utils_1.$el)(VIEWPORT_SELECTOR, this.element);
            this.addListener(viewport, "scroll", this.handleViewportScroll);
          }
          unmountComponent() {
            super.unmountComponent();
            const viewport = (0, utils_1.$el)(VIEWPORT_SELECTOR, this.element);
            this.removeListener(viewport, "scroll", this.handleViewportScroll);
          }
          handleViewportScroll = () => {
            const viewport = (0, utils_1.$el)(VIEWPORT_SELECTOR, this.element);
            viewport &&
              this.toggleAttribute(
                "header-shadow-visible",
                viewport.scrollTop > 0
              );
          };
        }
        exports.ProductInformationDrawer = ProductInformationDrawer;
      },
      2822: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductMediaCarousel = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          CAROUSEL_SELECTOR = "[data-product-media-carousel-component]";
        class ProductMediaCarousel extends base_component_1.BaseComponent {
          mountComponent() {
            this.setReady();
          }
          updateFirstMediaByVariant(variant, jump = !1) {
            const carousel = (0, utils_1.$el)(CAROUSEL_SELECTOR, this);
            if (variant && variant.featured_media && carousel) {
              const slideIndex = carousel.embla
                .slideNodes()
                .findIndex((slide) =>
                  slide.dataset.mediaId
                    ? +slide.dataset.mediaId == +variant.featured_media.id
                    : !1
                );
              carousel.embla.scrollTo(slideIndex, jump);
            }
          }
          setReady() {
            this.setAttribute("ready", "");
          }
        }
        exports.ProductMediaCarousel = ProductMediaCarousel;
      },
      3313: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductMedia = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          scrollOptions = (jump) => ({
            behavior: jump ? "auto" : "smooth",
            block: "nearest",
          });
        class ProductMedia extends base_component_1.BaseComponent {
          mountComponent() {
            this.setReady();
          }
          updateFirstMediaByVariant(variant, jump = !1) {
            (0, utils_1.isNotThemeStore)() &&
              variant &&
              variant.featured_media &&
              (
                (0, utils_1.$el)(
                  `[data-media-id="${variant.featured_media.id}"]`,
                  this
                ) ?? this
              ).scrollIntoView(scrollOptions(jump));
          }
          setReady() {
            this.setAttribute("ready", "");
          }
        }
        exports.ProductMedia = ProductMedia;
      },
      9783: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductModalButton = void 0);
        const utils_1 = __webpack_require__2(4083),
          modal_button_1 = __webpack_require__2(467);
        class ProductModalButton extends modal_button_1.ModalButton {
          trigger() {
            super.trigger(),
              (0, utils_1.$el)(this.dataset.modal)?.openAndShowMediaById(
                this.dataset.mediaId
              );
          }
        }
        exports.ProductModalButton = ProductModalButton;
      },
      5066: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductModalImageWrap = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083);
        class ProductModalImageWrap extends base_component_1.BaseComponent {
          image;
          modal;
          carousel;
          preloader;
          currentSettedScale;
          isDragging;
          offsetX;
          offsetY;
          startDragPoint;
          maxScale;
          minScale;
          isTapped;
          tapTimeout;
          lastGesture;
          zoomTimeoutId;
          isTappedTimeout;
          isDoubleTapped;
          firstMove;
          fingers;
          startMoveTouches;
          lastDistanceBetweenTouches;
          dragStartPointY;
          dragStartPointX;
          isPinchScaling;
          constructor() {
            super(),
              (this.image = (0, utils_1.$el)("img", this)),
              (this.modal = (0, utils_1.$elParent)("product-modal", this)),
              (this.preloader = (0, utils_1.$el)(
                "[data-product-modal-image-preloader]",
                this
              )),
              (this.currentSettedScale = 1),
              (this.isDragging = !1),
              (this.offsetX = 0),
              (this.offsetY = 0),
              (this.startDragPoint = { x: 0, y: 0 }),
              (this.maxScale = 3),
              (this.minScale = 1),
              (this.isTapped = !1),
              (this.tapTimeout = 300),
              (this.lastGesture = null),
              this.setZoomCursorVisible(!0);
          }
          mountComponent() {
            (this.carousel = this.modal.carousel),
              this.addListener(this.image, "mousedown", this.handleMouseDown),
              this.addListener(this.image, "mouseup", this.handleMouseUp),
              this.addListener(this.image, "mousemove", this.handleMouseMove),
              this.addListener(this.image, "touchstart", this.handleTouchStart),
              this.addListener(this.image, "touchend", this.handleTouchEnd),
              this.addListener(this.image, "touchmove", this.handleTouchMove),
              this.addListener(this.image, "load", this.handleImageLoad),
              (0, utils_1.whenDefined)("product-modal").then(() => {
                this.modal.on("hide", this.handleModalHide);
              }),
              this.carousel?.embla.on("select", this.handleCarouselSelect);
          }
          unmountComponent() {
            this.modal?.off("hide", this.handleModalHide),
              this.carousel?.embla.off("select", this.handleCarouselSelect),
              clearTimeout(this.zoomTimeoutId),
              clearTimeout(this.isTappedTimeout);
          }
          handleImageLoad = () => {
            this.setPreloaderVisible(!1);
          };
          handleModalHide = () => {
            this.reset();
          };
          handleCarouselSelect = () => {
            this.reset();
          };
          handleTouchStart = (event) => {
            event.preventDefault(),
              (this.fingers = event.touches.length),
              (this.firstMove = !0),
              this.detectDoubleTap(event);
          };
          handleTouchMove = (event) => {
            if ((event.preventDefault(), !this.isDoubleTapped)) {
              if (this.firstMove)
                this.updateGesture(event),
                  (this.startMoveTouches = event.touches.length);
              else if (this.lastGesture)
                switch (this.lastGesture) {
                  case "zoom":
                    this.startMoveTouches === 2 &&
                      event.touches.length === 2 &&
                      this.pinch(event);
                    break;
                  case "drag":
                    if (
                      this.startMoveTouches === 1 &&
                      event.touches.length === 1
                    ) {
                      const { clientX, clientY } = event.targetTouches[0];
                      this.drag(clientX, clientY);
                    }
                    break;
                }
              else this.setGesture("none", event);
              this.firstMove = !1;
            }
          };
          handleTouchEnd = (event) => {
            event.preventDefault(),
              (this.fingers = event.touches.length),
              this.updateGesture(event);
          };
          handleMouseDown = (event) => {
            event.preventDefault(),
              this.startDrag(event.clientX, event.clientY),
              this.setDragging(!0);
          };
          handleMouseUp = (event) => {
            this.setDragging(!1);
            const time = this.modal.isZoomed ? 75 : 0;
            this.zoomTimeoutId = setTimeout(() => {
              this.touchZoom(event.clientX, event.clientY);
            }, time);
          };
          handleMouseMove = (event) => {
            if (
              (event.preventDefault(),
              clearTimeout(this.zoomTimeoutId),
              this.isDragging && this.modal.isZoomed)
            ) {
              const { clientX, clientY } = event;
              this.drag(clientX, clientY);
            }
          };
          detectDoubleTap(event) {
            if (this.isTappedTimeout && this.fingers === 1)
              switch (
                (clearTimeout(this.isTappedTimeout),
                (this.isTappedTimeout = null),
                (this.isDoubleTapped = !0),
                this.touchZoom(
                  event.changedTouches[0].clientX,
                  event.changedTouches[0].clientY
                ),
                this.lastGesture)
              ) {
                case "zoom":
                  this.setPinchScaling(!1);
                  break;
                case "drag":
                  this.setDragging(!1);
                  break;
              }
            else
              this.isTappedTimeout = setTimeout(() => {
                (this.isTappedTimeout = null), (this.isDoubleTapped = !1);
              }, this.tapTimeout);
          }
          updateGesture(event) {
            this.fingers === 2
              ? this.setGesture("zoom", event)
              : this.fingers === 1
              ? this.setGesture("drag", event)
              : this.setGesture("none", event);
          }
          setGesture(newGesture, event) {
            if (this.lastGesture !== newGesture) {
              if (this.lastGesture && !newGesture)
                switch (this.lastGesture) {
                  case "zoom":
                    this.setPinchScaling(!1);
                    break;
                  case "drag":
                    this.setDragging(!1);
                    break;
                }
              switch (newGesture) {
                case "zoom":
                  this.setPinchScaling(!0);
                  break;
                case "drag":
                  this.startDrag(
                    event.changedTouches[0].clientX,
                    event.changedTouches[0].clientY
                  ),
                    this.setDragging(!0);
                  break;
                case "none":
                  this.setDragging(!1), this.setPinchScaling(!1);
                  break;
              }
            }
            this.lastGesture = newGesture;
          }
          pinch(event) {
            const distanceBetweenTouches =
                this.getDistanceBetweenTouches(event),
              isZoomIn =
                distanceBetweenTouches > this.lastDistanceBetweenTouches,
              factor = isZoomIn ? 0.125 : -0.125,
              newScale = this.getNewScale(this.currentScale + factor),
              midPoint = this.getTouchCenter(event),
              xs = (midPoint.x - this.offsetX) / this.currentScale,
              ys = (midPoint.y - this.offsetY) / this.currentScale;
            if (
              ((this.lastDistanceBetweenTouches = distanceBetweenTouches),
              !isZoomIn && newScale === 1)
            ) {
              this.reset();
              return;
            }
            this.setTransform({
              scale: newScale,
              offsetX: midPoint.x - xs * newScale,
              offsetY: midPoint.y - ys * newScale,
            });
          }
          getDistanceBetweenTouches(event) {
            return Math.hypot(
              event.touches[0].pageX - event.touches[1].pageX,
              event.touches[0].pageY - event.touches[1].pageY
            );
          }
          startDrag(clientX, clientY) {
            (this.startDragPoint = {
              x: clientX - this.offsetX,
              y: clientY - this.offsetY,
            }),
              (this.dragStartPointX = clientX),
              (this.dragStartPointY = clientY);
          }
          drag(clientX, clientY) {
            const isRightDrag = this.dragStartPointX > clientX,
              isBottomDrag = this.dragStartPointY > clientY,
              newScale = this.getNewScale(this.currentScale);
            let newOffsetX = clientX - this.startDragPoint.x,
              newOffsetY = clientY - this.startDragPoint.y;
            const isIntersectBounds = this.getIntersectBounds({
              isRightDrag,
              isBottomDrag,
            });
            (isIntersectBounds.right || isIntersectBounds.left) &&
              (newOffsetX = this.offsetX),
              (isIntersectBounds.bottom || isIntersectBounds.top) &&
                (newOffsetY = this.offsetY),
              this.setTransform({
                scale: newScale,
                offsetX: newOffsetX,
                offsetY: newOffsetY,
              });
          }
          getIntersectBounds({ isRightDrag, isBottomDrag }) {
            const imageRect = this.image.getBoundingClientRect(),
              delta = 8,
              deltaX = isRightDrag ? -1 * delta : delta,
              deltaY = isBottomDrag ? -1 * delta : delta,
              right =
                isRightDrag && imageRect.right + deltaX < window.innerWidth,
              left = !isRightDrag && imageRect.left + deltaX > 0,
              bottom =
                isBottomDrag && imageRect.bottom + deltaY < window.innerHeight,
              top = !isBottomDrag && imageRect.top + deltaY > 0;
            return { right, left, bottom, top };
          }
          getTouchCenter(event) {
            const sum = (a, b) => a + b,
              touches = [...event.touches],
              touchCount = touches.length;
            return {
              x: touches.map((touch) => touch.pageX).reduce(sum) / touchCount,
              y: touches.map((touch) => touch.pageY).reduce(sum) / touchCount,
            };
          }
          setTransform({ offsetX, offsetY, scale }) {
            (this.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale3d(${scale}, ${scale}, 1)`),
              (this.offsetX = offsetX),
              (this.offsetY = offsetY),
              (this.currentScale = scale);
          }
          touchZoom(clientX, clientY) {
            const xs = (clientX - this.offsetX) / this.currentScale,
              ys = (clientY - this.offsetY) / this.currentScale;
            let newScale, newOffsetX, newOffsetY;
            this.modal.isZoomed
              ? ((newScale = this.getNewScale(1)),
                (newOffsetX = 0),
                (newOffsetY = 0))
              : ((newScale = this.getNewScale(3)),
                (newOffsetX = clientX - xs * newScale),
                (newOffsetY = clientY - ys * newScale)),
              (this.style.cursor = this.modal.isZoomed ? "" : "grab"),
              this.setZoomCursorVisible(this.modal.isZoomed),
              this.setTransform({
                scale: newScale,
                offsetX: newOffsetX,
                offsetY: newOffsetY,
              });
          }
          reset() {
            this.setTransform({ scale: 1, offsetX: 0, offsetY: 0 });
          }
          getNewScale(newScale) {
            return Math.max(this.minScale, Math.min(this.maxScale, newScale));
          }
          setPinchScaling(isPinchScaling) {
            this.toggleAttribute("is-pinch-scaling", isPinchScaling),
              (this.isPinchScaling = isPinchScaling);
          }
          setDragging(isDragging) {
            this.toggleAttribute("is-dragging", isDragging),
              (this.isDragging = isDragging);
          }
          setZoomCursorVisible(isVisible) {
            this.image?.toggleAttribute("data-zoom-cursor-target", isVisible);
          }
          setModalZoom(isZoomed) {
            (this.modal.isZoomed = isZoomed),
              this.modal.isZoomed && (this.modal.zoomedImage = this),
              this.modal.updateModal();
          }
          setPreloaderVisible(isVisible) {
            this.preloader.classList.toggle("hidden", !isVisible),
              this.image?.toggleAttribute("is-loaded", !isVisible);
          }
          set currentScale(value) {
            this.currentSettedScale !== value &&
              (this.setModalZoom(value > 1), (this.currentSettedScale = value));
          }
          get currentScale() {
            return this.currentSettedScale;
          }
        }
        exports.ProductModalImageWrap = ProductModalImageWrap;
      },
      7327: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductModal = void 0);
        const modal_1 = __webpack_require__2(2549),
          check_media_1 = __webpack_require__2(5580),
          key_1 = __webpack_require__2(9650),
          utils_1 = __webpack_require__2(4083),
          CAROUSEL_SELECTOR = "[data-product-modal-carousel]",
          CAROUSEL_BUTTONS_SELECTOR = "[data-product-modal-carousel-button]",
          CAROUSEL_SLIDE_SELECTOR = "[data-product-modal-slide]",
          CAROUSEL_SELECTED_SLIDE_NUMBER_SELECTOR =
            "[data-product-modal-selected-slide-number]",
          ZOOM_CURSOR_SELECTOR = "zoom-cursor";
        class ProductModal extends modal_1.ModalComponent {
          carousel;
          mediaIndexMap;
          isZoomed = !1;
          zoomedImage;
          handleKeydown = (event) => {
            (0, key_1.isEscKey)(event) &&
              (this.isZoomed ? this.zoomedImage.reset() : this.hide());
          };
          handleCarouselInit = () => {
            this.updateCarouselDraggableState();
          };
          handleCarouselSelect = () => {
            this.updateSelectedSlideNumber();
          };
          openAndShowMediaById(mediaId) {
            if ((this.show(), !this.carousel)) return;
            const mediaIndex = this.mediaIndexMap[mediaId];
            this.carousel.embla.scrollTo(mediaIndex, !0);
            const carouselButtons = (0, utils_1.$list)(
              CAROUSEL_BUTTONS_SELECTOR,
              this.carousel
            );
            carouselButtons[0] && carouselButtons[0].focus(),
              this.updateSelectedSlideNumber();
          }
          initCarousel() {
            (this.mediaIndexMap = this.createMediaIndexMap()),
              this.element &&
                (this.carousel = (0, utils_1.$el)(
                  CAROUSEL_SELECTOR,
                  this.element
                )),
              this.carousel?.embla.on("select", this.handleCarouselSelect),
              this.carousel?.embla.on("init", this.handleCarouselInit);
          }
          resetCarousel() {
            this.carousel?.embla.off("select", this.handleCarouselSelect),
              this.carousel?.embla.off("init", this.handleCarouselInit);
          }
          hide() {
            this.resetCarousel(),
              super.hide(),
              (this.isZoomed = !1),
              this.updateModal(),
              this.emit("hide", {});
          }
          show() {
            super.show(), this.initCarousel();
          }
          updateSelectedSlideNumber() {
            const selectedSlideNumber = (0, utils_1.$el)(
              CAROUSEL_SELECTED_SLIDE_NUMBER_SELECTOR,
              this.element
            );
            if (!selectedSlideNumber || !this.carousel) return;
            const newSlideNumber = this.carousel.embla.selectedScrollSnap() + 1;
            selectedSlideNumber.textContent = String(newSlideNumber);
          }
          updateModal() {
            this.updateCarouselDraggableState(),
              this.updateZoomCursorState(),
              this.updateZoomState();
          }
          createMediaIndexMap() {
            return (0, utils_1.$list)(
              CAROUSEL_SLIDE_SELECTOR,
              this.element
            ).reduce(
              (acc, slide, index) =>
                slide.dataset.mediaId
                  ? { ...acc, [slide.dataset.mediaId]: index }
                  : acc,
              {}
            );
          }
          updateCarouselDraggableState() {
            if (this.carousel) {
              if (!(0, check_media_1.isMobile)()) {
                this.carousel.reInit({ watchDrag: !1 });
                return;
              }
              this.carousel.reInit({ watchDrag: !this.isZoomed });
            }
          }
          updateZoomCursorState() {
            const zoomCursor = (0, utils_1.$el)(ZOOM_CURSOR_SELECTOR);
            zoomCursor && zoomCursor.updateState(this.isZoomed);
          }
          updateZoomState() {
            this.toggleAttribute("zoom-enabled", this.isZoomed);
          }
        }
        exports.ProductModal = ProductModal;
      },
      2913: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductModel = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          { Shopify: Shopify2 } = window,
          POSTER_SELECTOR = '[id^="Deferred-Poster-"]';
        class ProductModel extends base_component_1.BaseComponent {
          modelViewerUI;
          mountComponent() {
            const poster = (0, utils_1.$el)(POSTER_SELECTOR, this);
            this.addListener(poster, "click", this.handlePosterClick),
              this.carousel?.embla.on("settle", this.handleCarouselSelect);
          }
          unmountComponent() {
            this.carousel?.embla.off("settle", this.handleCarouselSelect);
          }
          handlePosterClick = () => {
            this.loadContent();
          };
          handleCarouselSelect = () => {
            this.carousel && this.setCarouselDraggable(!0);
          };
          loadContent() {
            this.getAttribute("loaded") ||
              (this.addModel(),
              this.setAttribute("loaded", "true"),
              this.carousel && this.setCarouselDraggable(!1)),
              Shopify2.loadFeatures(
                [
                  {
                    name: "model-viewer-ui",
                    version: "1.0",
                    onLoad: this.setupModelViewerUI.bind(this),
                  },
                ],
                () => {}
              );
          }
          addModel() {
            const template = (0, utils_1.$el)("template", this);
            if (!template || !template.content) return;
            const templateContent = template.content,
              content = document.createElement("div");
            content.appendChild(
              templateContent.firstElementChild.cloneNode(!0)
            );
            const modelViewer = (0, utils_1.$el)("model-viewer", content);
            this.appendChild(modelViewer);
          }
          setupModelViewerUI(errors) {
            errors ||
              (this.modelViewerUI = new Shopify2.ModelViewerUI(
                (0, utils_1.$el)("model-viewer", this)
              ));
          }
          setCarouselDraggable(isDraggable) {
            const modelViewer = (0, utils_1.$el)(
              ".shopify-model-viewer-ui",
              this
            );
            (this.carousel.dataset.draggable = isDraggable ? "true" : "false"),
              this.carousel.reInit({ watchDrag: isDraggable }),
              isDraggable &&
                modelViewer &&
                (modelViewer.remove(), this.removeAttribute("loaded"));
          }
          get carousel() {
            return (0, utils_1.$elParent)("carousel-component", this);
          }
        }
        (exports.ProductModel = ProductModel),
          (window.ProductModel = {
            loadShopifyXR() {
              Shopify2.loadFeatures(
                [
                  {
                    name: "shopify-xr",
                    version: "1.0",
                    onLoad: this.setupShopifyXR.bind(this),
                  },
                ],
                () => {}
              );
            },
            setupShopifyXR(errors) {
              if (!errors) {
                if (!window.ShopifyXR) {
                  document.addEventListener("shopify_xr_initialized", () =>
                    this.setupShopifyXR()
                  );
                  return;
                }
                (0, utils_1.$list)('[id^="ProductJSON-"]').forEach(
                  (modelJSON) => {
                    window.ShopifyXR.addModels(
                      JSON.parse(modelJSON.textContent)
                    ),
                      modelJSON.remove();
                  }
                ),
                  window.ShopifyXR.setupXRElements();
              }
            },
          }),
          window.addEventListener("DOMContentLoaded", () => {
            Shopify2.designMode &&
              (0, utils_1.$list)("[data-shopify-xr-hidden]").forEach(
                (element) => element.classList.add("hidden")
              ),
              window.ProductModel && window.ProductModel.loadShopifyXR();
          });
      },
      250: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.PickupAvailability = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083);
        class PickupAvailability extends base_component_1.BaseComponent {
          mountComponent() {
            this.fetchAvailability();
          }
          fetchAvailability() {
            const url = `${this.dataset.baseUrl}variants/${this.dataset.variantId}/?section_id=pickup-availability`;
            fetch(url)
              .then((response) => response.text())
              .then((text) => {
                const html = (0, utils_1.$el)(
                  ".shopify-section",
                  (0, dom_1.parseHTML)(text)
                );
                this.updateSidebarFromHTML(html),
                  this.updateContentFromHTML(html);
              })
              .catch(() => {
                console.log("Error in pickup availability component");
              });
          }
          updateVariantId(newVariantId) {
            this.dataset.variantId = newVariantId;
          }
          updateContentFromHTML(section) {
            const content = (0, utils_1.$el)(
                "pickup-availability-content",
                this
              ),
              newContent = (0, utils_1.$el)(
                "pickup-availability-content",
                section
              );
            (0, dom_1.replaceNodeChildren)(content, newContent);
          }
          updateSidebarFromHTML(section) {
            const drawer = (0, utils_1.$el)("#pickup-availability-sidebar");
            if (!drawer) return;
            const newTemplate = (0, utils_1.$el)(
              `[data-sidebar-template="${drawer.id}"]`,
              section
            );
            newTemplate && drawer.updateTemplate(newTemplate);
          }
        }
        exports.PickupAvailability = PickupAvailability;
      },
      453: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.VariantPicker = void 0);
        const base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          key_1 = __webpack_require__2(9650),
          ELEMENTS = [
            "sticky-product-buy-btn",
            "product-buy-btn",
            "product-quantity",
          ],
          BLOCKS = [
            "product-price",
            "product-badges",
            "product-sku",
            "product-stock",
          ],
          VARIANTS_JSON_SELECTOR = "[data-variant-picker-variants]",
          OPTION_INPUTS_SELECTOR = "[data-variant-picker-option-inputs]",
          OPTION_LABELS_SELECTOR = "[data-variant-picker-option-labels]",
          DROPDOWN_LABEL_SELECTOR = "[data-dropdown-variant-picker-label]",
          ARROW_KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"],
          HEADER_SELECTOR = "header-component";
        class VariantPicker extends base_component_1.BaseComponent {
          variants;
          variant;
          constructor() {
            super(),
              (this.variants = JSON.parse(
                (0, utils_1.$el)(VARIANTS_JSON_SELECTOR, this).textContent
              ));
          }
          mountComponent() {
            this.setVariant(),
              this.setOptionsAvailable(),
              this.hasAttribute("data-initial-selected-variant") &&
                this.setFirstMedia(!0),
              this.setListeners();
          }
          handleVariantChange = (event) => {
            this.setVariant();
            const targetUrl = event.target.dataset.productUrl;
            if (targetUrl && this.dataset.url !== targetUrl) {
              this.swapProduct(targetUrl);
              return;
            }
            this.setOptionsAvailable(),
              this.updateLabels(),
              this.updateStock(),
              this.variant &&
                (this.updatePickupAvailability(),
                this.updateURL(),
                this.updateVariantInput(),
                this.updateSection(),
                this.hasAttribute("data-product-media-filtering-option") ||
                  this.setFirstMedia(!1),
                this.emit("change", {
                  variant: this.variant,
                  option: {
                    name: event.target.name,
                    value: event.target.value,
                  },
                }));
          };
          toggleHeaderDynamicShow = (bool) => {
            (0, utils_1.$el)(HEADER_SELECTOR).toggleLockDynamicShow(bool);
          };
          swapProduct(productUrl) {
            const product = this.closest(".shopify-section"),
              quickView = this.closest("quick-view"),
              selectedOptionsIds = (0, utils_1.$list)(
                OPTION_INPUTS_SELECTOR,
                this
              ).map(
                (option) =>
                  this.getCheckedInput((0, utils_1.$list)("input", option))
                    .dataset.valueId
              ),
              params = this.variant
                ? `variant=${this.variant?.id}`
                : `option_values=${selectedOptionsIds.join(",")}`;
            fetch(
              `${productUrl}?section_id=${this.dataset.sectionIdWithoutPrefix}&${params}`
            )
              .then((response) => response.text())
              .then((responseText) => {
                const html = new DOMParser().parseFromString(
                  responseText,
                  "text/html"
                );
                if (product) {
                  const newProduct = html.getElementById(
                    `shopify-section-${this.dataset.sectionIdWithoutPrefix}`
                  );
                  product.innerHTML = newProduct.innerHTML;
                } else quickView && quickView.setProductFromHTML(html);
              }),
              window.history.replaceState({}, "", `${productUrl}`);
          }
          updateLabels() {
            const inputContainers = (0, utils_1.$list)(
                OPTION_INPUTS_SELECTOR,
                this
              ),
              labelContainers = (0, utils_1.$list)(
                OPTION_LABELS_SELECTOR,
                this
              );
            inputContainers.forEach((inputContainer, idx) => {
              const labels = (0, utils_1.$list)("label", labelContainers[idx]),
                inputs = (0, utils_1.$list)("input", inputContainer),
                input = this.getCheckedInput(inputs),
                dropdownLabel = (0, utils_1.$el)(
                  DROPDOWN_LABEL_SELECTOR,
                  labelContainers[idx]
                );
              dropdownLabel &&
                dropdownLabel.toggleAttribute(
                  "no-available",
                  !this.variant?.available
                ),
                labels.forEach((label) => {
                  const isSelected = label.getAttribute("for") === input.id;
                  if (dropdownLabel && isSelected) {
                    const dropdown = (0, utils_1.$elParent)(
                      "dropdown-opener",
                      dropdownLabel
                    );
                    (0, dom_1.replaceNodeChildren)(dropdownLabel, label),
                      dropdown.trigger();
                  }
                  label.classList.toggle("selected", isSelected);
                });
            });
          }
          updateURL() {
            !this.variant ||
              this.dataset.updateUrl === "false" ||
              window.history.replaceState(
                {},
                "",
                `${this.dataset.url}?variant=${this.variant.id}`
              );
          }
          updateStock() {
            (0, utils_1.$el)(
              `#product-stock-inner-${this.dataset.productId}-${this.dataset.section}`
            )?.classList.toggle("hidden", !this.variant);
          }
          setVariant() {
            const selectedOptions = (0, utils_1.$list)(
              OPTION_INPUTS_SELECTOR,
              this
            ).map(
              (option) =>
                this.getCheckedInput((0, utils_1.$list)("input", option)).value
            );
            (this.variant = this.variants.find(({ options: options2 }) =>
              options2.every(
                (option, index) => selectedOptions[index] === option
              )
            )),
              this.variant ||
                (0, utils_1.whenDefined)("product-form").then(() => {
                  this.setUnavailable();
                });
          }
          setUnavailable() {
            this.getForm()?.setDisable(!0),
              this.getForm()?.setButtonText(
                window.auroraThemeLocales.variantStrings.unavailable
              );
          }
          setListeners() {
            const dropdownLabels = (0, utils_1.$list)("float-element", this)
                .map((dropdown) =>
                  (0, utils_1.$list)("label", dropdown.element)
                )
                .flat(1),
              simpleLabels = (0, utils_1.$list)("label", this),
              labels = [...dropdownLabels, ...simpleLabels];
            this.addListener(this, "keydown", this.handleKeydown),
              labels.forEach((label) => {
                this.addListener(label, "keydown", this.handleLabelKeydown);
              }),
              this.addListener(this, "change", this.handleVariantChange);
          }
          handleLabelKeydown = (event) => {
            if ((0, key_1.isEnterKey)(event)) {
              event.preventDefault();
              const target = event.target,
                input = (0, utils_1.$el)(
                  `input[id="${target.getAttribute("for")}"]`,
                  this
                );
              input &&
                input.dispatchEvent(
                  new MouseEvent("click", { button: 0, which: 1 })
                );
            }
          };
          handleKeydown = (event) => {
            if (!ARROW_KEYS.includes(event.key) && !(0, key_1.isTabKey)(event))
              return;
            const target = event.target,
              labelContainer = (0, utils_1.$elParent)(
                OPTION_LABELS_SELECTOR,
                target
              );
            if (!labelContainer) {
              this.removeListener(document, "keydown", this.handleLabelKeydown);
              return;
            }
            const labels = (0, utils_1.$list)("label", labelContainer),
              index = labels.findIndex((label) => label === event.target),
              currentLabel = labels[index],
              firstLabel = labels[0],
              lastLabel = labels[labels.length - 1],
              nextLabel = labels[index + 1],
              prevLabel = labels[index - 1],
              setActiveLabel = (newLabel) => {
                currentLabel?.removeAttribute("tabindex"),
                  newLabel.setAttribute("tabindex", 0),
                  newLabel.focus(),
                  event.preventDefault();
              },
              changeActiveLabelOnNext = () => {
                setActiveLabel(nextLabel || firstLabel);
              },
              changeActiveLabelOnPrev = () => {
                setActiveLabel(prevLabel || lastLabel);
              },
              callback = {
                ArrowLeft: changeActiveLabelOnPrev,
                ArrowRight: changeActiveLabelOnNext,
                ArrowUp: changeActiveLabelOnPrev,
                ArrowDown: changeActiveLabelOnNext,
              }[event.key];
            (0, key_1.isTabKey)(event)
              ? prevLabel && event.shiftKey
                ? changeActiveLabelOnPrev()
                : nextLabel && !event.shiftKey && changeActiveLabelOnNext()
              : callback();
          };
          getVariantsByOption(prevOptions) {
            const availableVariants = this.variants
              .filter((variant) => variant.available)
              .map((variant) => variant.options);
            return prevOptions
              ? availableVariants.filter((options) =>
                  prevOptions.every((prevOption) =>
                    options.includes(prevOption.value)
                  )
                )
              : availableVariants;
          }
          async getDropdownElementBySelector(selector) {
            const dropdowns = (0, utils_1.$list)("float-element", this);
            let elementBySelector;
            return (
              await (0, utils_1.whenDefined)("float-element").then(() => {
                elementBySelector = (0, utils_1.$el)(
                  selector,
                  dropdowns.find((dropdown) =>
                    (0, utils_1.$el)(selector, dropdown.element)
                  ).element
                );
              }),
              elementBySelector
            );
          }
          async setOptions(options, possibleVariants) {
            for (const option of options) {
              const available = possibleVariants.some((variant) =>
                  variant.includes(option.value)
                ),
                labelSelector = `label[for="${option.id}"]`;
              (
                (0, utils_1.$el)(labelSelector, this) ||
                (await this.getDropdownElementBySelector(labelSelector))
              ).toggleAttribute("no-available", !available);
            }
          }
          setOptionsAvailable() {
            const options = (0, utils_1.$list)(OPTION_INPUTS_SELECTOR, this),
              firstOptions =
                options[0] && (0, utils_1.$list)("input", options[0]),
              firstOption = this.getCheckedInput(firstOptions);
            this.setOptions(firstOptions, this.getVariantsByOption([]));
            const secondOptions =
              options[1] && (0, utils_1.$list)("input", options[1]);
            if (secondOptions) {
              const secondOption = this.getCheckedInput(secondOptions);
              this.setOptions(
                secondOptions,
                this.getVariantsByOption([firstOption])
              );
              const thirdOptions =
                options[2] && (0, utils_1.$list)("input", options[2]);
              thirdOptions &&
                this.setOptions(
                  thirdOptions,
                  this.getVariantsByOption([firstOption, secondOption])
                );
            }
          }
          setFirstMedia(isForceAnimation) {
            (0, utils_1.$list)(
              `#product-media-${this.dataset.productId}-${this.dataset.section}`
            ).forEach((media) =>
              media.updateFirstMediaByVariant(this.variant, isForceAnimation)
            );
          }
          setFirstMediaByVariant(variantId) {
            (0, utils_1.$list)(
              `#product-media-${this.dataset.productId}-${this.dataset.section}`
            ).forEach((media) => media.updateFirstMediaByVariant(variantId));
          }
          updateVariantInput() {
            const form = (0, utils_1.$el)(
              `#product-form-component-${this.dataset.productId}-${this.dataset.section}`
            );
            form &&
              (form
                .getVeriantInput()
                .setAttribute("value", String(this.variant.id)),
              form
                .getVeriantInput()
                .dispatchEvent(new Event("change", { bubbles: !0 })));
          }
          updatePickupAvailability() {
            const pickupAvailability = (0, utils_1.$el)(
              `#product-pickup-availability-${this.dataset.productId}-${this.dataset.section}`
            );
            pickupAvailability &&
              (pickupAvailability.updateVariantId(this.variant.id),
              pickupAvailability.fetchAvailability());
          }
          updateSection() {
            this.toggleHeaderDynamicShow(!0);
            const form = (0, utils_1.$el)(
              `#product-form-component-${this.dataset.productId}-${this.dataset.section}`
            );
            this.updateBlocks(),
              form?.setDisable(!0),
              form?.setLoading(!0),
              fetch(
                `${this.dataset.url}?variant=${this.variant.id}&section_id=${this.dataset.sectionIdWithoutPrefix}`
              )
                .then((response) => response.text())
                .then((responseText) => {
                  form?.setDisable(!this.variant.available),
                    form?.setLoading(!1),
                    this.updateElements((0, dom_1.parseHTML)(responseText));
                })
                .catch(() => {
                  console.log("Error in variant picker component");
                })
                .finally(() => {
                  this.toggleHeaderDynamicShow(!1);
                });
          }
          updateElements(html) {
            ELEMENTS.forEach((block) => {
              const id = `${block}-${this.dataset.productId}-${this.dataset.section}`,
                target = (0, utils_1.$el)(`#${id}`),
                newTarget = (0, utils_1.$el)(`#${id}`, html);
              (0, dom_1.replaceNodeChildren)(target, newTarget);
            });
          }
          updateBlocks() {
            BLOCKS.forEach((blockId) => {
              (0, utils_1.$el)(
                `#${blockId}-${this.dataset.productId}-${this.dataset.section}`
              )?.updateByVariantId(this.variant.id);
            });
          }
          getCheckedInput(inputs) {
            return inputs.find(({ checked }) => checked);
          }
          getForm() {
            return (0, utils_1.$el)(
              `#product-form-component-${this.dataset.productId}-${this.dataset.section}`
            );
          }
        }
        exports.VariantPicker = VariantPicker;
      },
      4218: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.QuickView = void 0);
        const dom_1 = __webpack_require__2(3889),
          utils_1 = __webpack_require__2(4083),
          recently_viewed_1 = __webpack_require__2(8195),
          sidebar_1 = __webpack_require__2(4622),
          { Shopify: Shopify2 } = window;
        class QuickView extends sidebar_1.SidebarComponent {
          cache = {};
          rendered;
          content;
          requestProductFromUrl(url, id) {
            this.cache[url] ||
              ((this.rendered = (0, utils_1.$el)(
                `.shopify-section [data-quick-view-product-id="${id}"]`
              )),
              this.rendered && this.rendered.dataset.quickViewProductUrl === url
                ? (this.cache[url] = (0, utils_1.delay)(0).then(
                    () => this.rendered
                  ))
                : (this.cache[url] = fetch(url)
                    .then((response) => response.text())
                    .then((responseText) => (0, dom_1.parseHTML)(responseText))
                    .catch(() => console.log("error in quick view"))));
          }
          handleContentScroll = () => {
            const isScrolled = this.content ? this.content.scrollTop > 0 : !1;
            this.toggleAttribute("header-shadow-visible", isScrolled);
          };
          openAndRenderProductByUrl = async (url) => {
            if (this.cache[url]) {
              let html;
              await this.cache[url].then((result) => {
                html = result;
              }),
                this.rendered && this.rendered.replaceChildren(),
                this.isOpen && (await this.hide()),
                this.setProductFromHTML(html),
                Shopify2?.PaymentButton?.init(),
                await this.open();
            }
          };
          setProductFromHTML(html) {
            if (this.dataset.targetId) {
              const target = (0, utils_1.$el)(
                `#${this.dataset.targetId}`,
                html
              );
              if (target) {
                recently_viewed_1.RecentlyViewed.updateProductsInLocalStorage(
                  target.dataset.productHandle
                );
                const targetClass = target.getAttribute("class") || "",
                  clonedTarget = target.cloneNode(!0);
                this.element.setAttribute("class", targetClass),
                  this.element.replaceChildren(...clonedTarget.childNodes),
                  (this.content = (0, utils_1.$el)(
                    "[data-quick-view-content]",
                    this.element
                  )),
                  this.addListener(
                    this.content,
                    "scroll",
                    this.handleContentScroll
                  );
              }
            }
          }
          resetProduct() {
            this.content &&
              (this.removeListener(
                this.content,
                "scroll",
                this.handleContentScroll
              ),
              this.rendered &&
                (0, dom_1.replaceNodeChildren)(this.rendered, this.content),
              (this.content = null)),
              this.element.replaceChildren();
          }
        }
        exports.QuickView = QuickView;
      },
      1893: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.RecipientForm = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          RECIPIENT_FORM_CHECKBOX_SELECTOR = "[data-recipient-form-checkbox]",
          RECIPIENT_FORM_TIMEZONE_INPUT_SELECTOR =
            "[data-recipient-form-timezone-input]",
          RECIPIENT_FORM_INPUT_SELECTOR = "[data-recipient-form-input]",
          RECIPIENT_FORM_FIELDS_SELECTOR = "[data-recipient-form-fields]";
        class RecipientForm extends base_component_1.BaseComponent {
          mountComponent() {
            this.addListener(this, "change", this.handleChange);
          }
          handleChange() {
            const checkbox = (0, utils_1.$el)(
              RECIPIENT_FORM_CHECKBOX_SELECTOR,
              this
            );
            this.updateHeight(checkbox.checked),
              this.updateDisable(!checkbox.checked),
              checkbox.checked || this.clearInputs();
          }
          clearInputs() {
            (0, utils_1.$list)(
              `${RECIPIENT_FORM_INPUT_SELECTOR}, ${RECIPIENT_FORM_TIMEZONE_INPUT_SELECTOR}`,
              this
            ).forEach((input) => {
              input.value = "";
            });
          }
          updateDisable(isDisabled) {
            (0, utils_1.$list)(
              `${RECIPIENT_FORM_INPUT_SELECTOR}, ${RECIPIENT_FORM_TIMEZONE_INPUT_SELECTOR}`,
              this
            ).forEach((field) => {
              field.disabled = isDisabled;
            });
          }
          reset() {
            const checkbox = (0, utils_1.$el)(
              RECIPIENT_FORM_CHECKBOX_SELECTOR,
              this
            );
            (checkbox.checked = !1), this.clearInputs();
          }
          updateHeight(isChecked) {
            const fields = (0, utils_1.$el)(
              RECIPIENT_FORM_FIELDS_SELECTOR,
              this
            );
            fields &&
              (fields.style.maxHeight = `${
                isChecked ? fields.scrollHeight : 0
              }px`);
          }
          setTimezone() {
            const timezoneInput = (0, utils_1.$el)(
              RECIPIENT_FORM_TIMEZONE_INPUT_SELECTOR,
              this
            );
            timezoneInput.value = String(new Date().getTimezoneOffset());
          }
        }
        exports.RecipientForm = RecipientForm;
      },
      9129: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ProductRelatedBlock = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          dom_1 = __webpack_require__2(3889);
        class ProductRelatedBlock extends base_component_1.BaseComponent {
          mountComponent() {
            this.loadProducts();
          }
          loadProducts() {
            return (
              this.setAttribute("is-loading", ""),
              fetch(this.dataset.url)
                .then((response) => response.text())
                .then((text) => {
                  this.updateByHTML((0, dom_1.parseHTML)(text)),
                    this.removeAttribute("is-loading");
                })
                .catch(() => {
                  console.log("Error in product recommendations component");
                })
            );
          }
          updateByHTML(html) {
            const recommendations = (0, utils_1.$el)(`#${this.id}`, html);
            (0, dom_1.replaceNodeChildren)(this, recommendations),
              this.toggleAttribute("is-ready", this.hasChildNodes());
          }
        }
        exports.ProductRelatedBlock = ProductRelatedBlock;
      },
      9220: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ZoomCursor = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          check_media_1 = __webpack_require__2(5580),
          ZOOM_TARGET_SELECTOR = "[data-zoom-cursor-target]";
        class ZoomCursor extends base_component_1.BaseComponent {
          mutationObserver;
          constructor() {
            super(),
              (this.mutationObserver = new MutationObserver(
                this.handleMutations
              ));
          }
          mountComponent() {
            this.addListener(window, "mousemove", this.handleMouseMove);
          }
          unmountComponent() {
            this.mutationObserver.disconnect();
          }
          handleMutations = (mutations) => {
            mutations.forEach((mutation) => {
              mutation.type === "attributes" &&
                this.setVisible(mutation.target.matches(ZOOM_TARGET_SELECTOR));
            });
          };
          handleMouseMove = (event) => {
            const target = event.target,
              isTarget = !!(0, utils_1.$elParent)(ZOOM_TARGET_SELECTOR, target);
            (0, check_media_1.isMobile)() ||
              (this.setVisible(isTarget),
              this.isVisible &&
                (this.style.transform = `translate(calc(-50% + ${event.clientX}px), calc(-50% + ${event.clientY}px))`)),
              isTarget
                ? this.mutationObserver.observe(target, { attributes: !0 })
                : this.mutationObserver.disconnect();
          };
          setVisible(isVisible) {
            this.classList.toggle("is-visible", isVisible),
              (document.body.style.cursor = isVisible ? "none" : "");
          }
          updateState(isZoomed) {
            this.toggleAttribute("zoomed", isZoomed);
          }
          get isVisible() {
            return this.classList.contains("is-visible");
          }
        }
        exports.ZoomCursor = ZoomCursor;
      },
      766: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.RecentlyViewed = void 0);
        var recently_viewed_1 = __webpack_require__2(8195);
        Object.defineProperty(exports, "RecentlyViewed", {
          enumerable: !0,
          get: function () {
            return recently_viewed_1.RecentlyViewed;
          },
        });
      },
      8195: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.RecentlyViewed = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          defaultCardsLimit = 50,
          defaultCardImgRatio = "portrait",
          defaultCardAlignment = "left",
          containerAttribute = "[recently-viewed-container]",
          localStorageSelector = "AuroraTheme-RecentlyViewed",
          cardTemplateSelector = "product-card-template",
          cardSelector = "product-card",
          cardInnerSelector = "[data-product-card-inner]";
        class RecentlyViewed extends base_component_1.BaseComponent {
          cardLimit;
          cardImgRatio;
          cardAlignment;
          cardAlignmentClass;
          shapeClass;
          products;
          container;
          constructor() {
            super(),
              (this.cardLimit = +this.dataset.cardLimit),
              (this.cardImgRatio =
                this.dataset.imgRatio ?? defaultCardImgRatio),
              (this.cardAlignment =
                this.dataset.cardAlignment ?? defaultCardAlignment),
              (this.cardAlignmentClass = `product-card--${this.cardAlignment}-alignment`),
              (this.shapeClass = `shape--${this.cardImgRatio}`),
              (this.products = []),
              (this.container = (0, utils_1.$el)(containerAttribute, this));
          }
          async mountComponent() {
            await this.fetchItems(),
              this.products.length > 0 &&
                (this.setItems(), this.setVisible(!0));
          }
          fetchItems = async () => {
            const { origin } = window.location,
              locale = window.Shopify.routes.root ?? "/",
              currentSavedProducts = JSON.parse(
                localStorage.getItem(localStorageSelector)
              )?.slice(0, this.cardLimit);
            if (currentSavedProducts)
              try {
                for (const handle of currentSavedProducts) {
                  const section = await fetch(
                      `${origin}${locale}products/${handle}?sections=product-card-template`
                    ).then((res) => res.json()),
                    node = this.createNodeByString(
                      section[cardTemplateSelector]
                    );
                  node && this.products.push(node);
                }
              } catch (error) {
                console.log(error);
              }
          };
          setItems = () => {
            this.container.replaceChildren(...this.products);
          };
          setVisible(isVisible) {
            this.classList.toggle("hidden", !isVisible);
          }
          createNodeByString(productString) {
            const html = new DOMParser().parseFromString(
                productString,
                "text/html"
              ),
              node = (0, utils_1.$el)(`.${cardTemplateSelector}`, html);
            (0, utils_1.$el)(cardSelector, node)?.classList.add(
              this.cardAlignmentClass
            ),
              (0, utils_1.$el)(cardInnerSelector, node)?.classList.add(
                this.shapeClass
              ),
              this.shapeClass.includes("fit") &&
                (0, utils_1.$el)(cardInnerSelector, node)?.classList.add(
                  "shape--fit"
                );
            const productCard = node.querySelector("product-card");
            if (productCard) {
              const slide = document.createElement("div"),
                cardToAdd = productCard.cloneNode(!0);
              return (
                slide.classList.add("slider-grid__slide"),
                slide.setAttribute("slider-grid-slide", ""),
                slide.append(cardToAdd),
                slide
              );
            } else return null;
          }
          static updateProductsInLocalStorage(handle) {
            if (!handle) return;
            const currentSavedProducts =
                JSON.parse(localStorage.getItem(localStorageSelector)) ?? [],
              newProducts = currentSavedProducts?.find(
                (item) => item === handle
              )
                ? currentSavedProducts
                : [handle, ...currentSavedProducts].slice(0, defaultCardsLimit);
            localStorage.setItem(
              localStorageSelector,
              JSON.stringify(newProducts)
            );
          }
        }
        exports.RecentlyViewed = RecentlyViewed;
      },
      1796: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ScrollingTextLine = exports.ScrollingText = void 0);
        var scrolling_text_1 = __webpack_require__2(2937);
        Object.defineProperty(exports, "ScrollingText", {
          enumerable: !0,
          get: function () {
            return scrolling_text_1.ScrollingText;
          },
        });
        var scrolling_text_line_1 = __webpack_require__2(3355);
        Object.defineProperty(exports, "ScrollingTextLine", {
          enumerable: !0,
          get: function () {
            return scrolling_text_line_1.ScrollingTextLine;
          },
        });
      },
      3355: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ScrollingTextLine = void 0);
        const debounce_1 = __webpack_require__2(2731),
          base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          ANNOUNCEMENT_SELECTOR = "[data-scrolling-text-line]",
          LINE_LINK_SELECTOR = "[data-scrolling-text-anchor]",
          ANIMATION_CLASS = "scrolling-text--animated",
          FONT_MIXED_ATTRIBUTE = "with-font-mixed",
          FONT_OUTLINE_CLASS = "scrolling-text__text--font-outline";
        class ScrollingTextLine extends base_component_1.BaseComponent {
          announcement;
          initialScreenWidth = 0;
          isWithFontMixed;
          screenSizeMultiply = 2;
          resizeObserver;
          constructor() {
            super(),
              (this.isWithFontMixed = this.hasAttribute(FONT_MIXED_ATTRIBUTE));
          }
          mountComponent() {
            (this.resizeObserver = new ResizeObserver(this.handleResize)),
              this.resizeObserver.observe(document.body);
          }
          unmountComponent() {
            this.resizeObserver.disconnect();
          }
          getDimentions = () => {
            const announcement = (0, utils_1.$el)(ANNOUNCEMENT_SELECTOR, this);
            if (!announcement) return;
            const screenWidth = document.body.clientWidth,
              announcementWidth = announcement.clientWidth;
            return (
              (this.initialScreenWidth = screenWidth),
              { screenWidth, announcementWidth }
            );
          };
          calcQuantityToRender = (screenWidth, announcementWidth) => {
            const blocksToRender = Math.ceil(
              (screenWidth * this.screenSizeMultiply) / announcementWidth
            );
            return blocksToRender % 2 === 0
              ? blocksToRender
              : blocksToRender + 1;
          };
          renderNodes = (blocksNumberToRender) => {
            this.announcement ||
              (this.announcement = (0, utils_1.$el)(
                ANNOUNCEMENT_SELECTOR,
                this
              ).cloneNode(!0));
            const announcement = this.announcement.cloneNode(!0),
              link = (0, utils_1.$el)(LINE_LINK_SELECTOR, this);
            if (!announcement) return;
            const nodes = this.isWithFontMixed
              ? this.getFragmentWithMixedFont(
                  blocksNumberToRender,
                  announcement
                )
              : this.getFragment(blocksNumberToRender, announcement);
            link && nodes.appendChild(link), this.replaceChildren(nodes);
          };
          getFragment = (blocksNumberToRender, announcement) => {
            const fragment = document.createDocumentFragment(),
              announcements = [];
            for (let i = 0; i < blocksNumberToRender; i++) {
              const clonedAnnouncement = announcement.cloneNode(!0);
              let newClass = ANIMATION_CLASS;
              this.isWithFontMixed &&
                i % 2 === 0 &&
                (newClass += ` ${FONT_OUTLINE_CLASS}`),
                clonedAnnouncement.classList.add(newClass),
                announcements.push(clonedAnnouncement);
            }
            return fragment.replaceChildren(...announcements), fragment;
          };
          getFragmentWithMixedFont = (blocksNumberToRender, announcement) => {
            const fragment = document.createDocumentFragment(),
              announcements = [];
            for (let i = 0; i < blocksNumberToRender - 1; i++) {
              const clonedAnnouncement1 = announcement.cloneNode(!0),
                clonedAnnouncement2 = announcement.cloneNode(!0),
                div = document.createElement("div");
              clonedAnnouncement1.classList.add(FONT_OUTLINE_CLASS),
                div.replaceChildren(clonedAnnouncement1, clonedAnnouncement2),
                div.classList.add(ANIMATION_CLASS),
                announcements.push(div);
            }
            return fragment.replaceChildren(...announcements), fragment;
          };
          handleResize = (0, debounce_1.debounce)(() => {
            document.body.clientWidth > this.initialScreenWidth &&
              this.render(),
              this.setAttribute("data-is-rendered", "true");
          }, 100);
          render = () => {
            const { screenWidth, announcementWidth } = this.getDimentions(),
              blocksNumberToRender = this.calcQuantityToRender(
                screenWidth,
                announcementWidth
              );
            this.renderNodes(blocksNumberToRender);
          };
        }
        exports.ScrollingTextLine = ScrollingTextLine;
      },
      2937: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.ScrollingText = void 0);
        const debounce_1 = __webpack_require__2(2731),
          base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          CONTAINER_SELECTOR = "[data-scrolling-text-container]",
          LINE_SELECTOR = "scrolling-text-line";
        class ScrollingText extends base_component_1.BaseComponent {
          resizeObserver;
          paddings;
          mountComponent() {
            const container = (0, utils_1.$el)(CONTAINER_SELECTOR, this);
            (this.resizeObserver = new ResizeObserver(this.handleResize)),
              this.resizeObserver.observe(container);
          }
          unmountComponent() {
            this.resizeObserver.disconnect();
          }
          calcHeight = () => {
            const container = (0, utils_1.$el)(CONTAINER_SELECTOR, this),
              styles = getComputedStyle(container);
            this.paddings =
              parseInt(styles.paddingTop) + parseInt(styles.paddingBottom);
            const lines = (0, utils_1.$list)(LINE_SELECTOR, this);
            let heightToSet;
            const firstLineRect = lines[0].getBoundingClientRect();
            if (lines.length > 1) {
              const coordsTop = [],
                coordsBottom = [],
                lastLineRect = lines[lines.length - 1].getBoundingClientRect();
              coordsTop.push(firstLineRect.top),
                coordsTop.push(lastLineRect.top),
                coordsBottom.push(firstLineRect.bottom),
                coordsBottom.push(lastLineRect.bottom),
                (heightToSet =
                  coordsBottom.sort((a, b) => b - a)[0] -
                  coordsTop.sort((a, b) => a - b)[0]);
            } else heightToSet = firstLineRect.height;
            return heightToSet;
          };
          setHeight = () => {
            this.style.setProperty(
              "--gsc-section-height",
              `${this.calcHeight()}px`
            );
          };
          handleResize = (0, debounce_1.debounce)(() => {
            this.setHeight();
          }, 100);
        }
        exports.ScrollingText = ScrollingText;
      },
      9728: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SearchSidebarFormWrapper = exports.SearchSidebar = void 0);
        var search_sidebar_1 = __webpack_require__2(989);
        Object.defineProperty(exports, "SearchSidebar", {
          enumerable: !0,
          get: function () {
            return search_sidebar_1.SearchSidebar;
          },
        });
        var search_sidebar_form_wrapper_1 = __webpack_require__2(550);
        Object.defineProperty(exports, "SearchSidebarFormWrapper", {
          enumerable: !0,
          get: function () {
            return search_sidebar_form_wrapper_1.SearchSidebarFormWrapper;
          },
        });
      },
      550: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SearchSidebarFormWrapper = void 0);
        const base_component_1 = __webpack_require__2(3608),
          search_api_1 = __webpack_require__2(3191),
          dom_1 = __webpack_require__2(3889),
          debounce_1 = __webpack_require__2(2731),
          utils_1 = __webpack_require__2(4083),
          SEARCH_FIELD_SELECTOR = "[data-sidebar-search-input-component]",
          CONTENT_RESULTS_SELECTOR = "[data-sidebar-search-content-results]",
          FOOTER_SELECTOR = "[data-sidebar-search-footer]",
          ITEM_SELECTOR = "[data-sidebar-search-item]",
          SEARCH_SIDEBAR_SELECTOR = "#SearchSidebar";
        class SearchSidebarFormWrapper extends base_component_1.BaseComponent {
          predictiveSearchAPI = new search_api_1.PredictiveSearchAPI();
          mountComponent() {
            this.addListener(this, "input", this.handleInputChange);
          }
          handleInputChange = (0, debounce_1.debounce)(() => {
            this.searchQuery ? this.renderResults() : this.resetResults();
          }, 500);
          renderResults() {
            this.renderFromUrl(this.searchQuery);
          }
          resetResults() {
            const sidebar = (0, utils_1.$elParent)(
              SEARCH_SIDEBAR_SELECTOR,
              this
            );
            sidebar && this.updateResultsFromHTML(sidebar.defaultStateElement);
          }
          renderFromUrl(queryKey) {
            const sidebar = (0, utils_1.$elParent)(
                SEARCH_SIDEBAR_SELECTOR,
                this
              ),
              sectionId = sidebar?.dataset.sectionId || "search-sidebar",
              limitParam = "resources[limit]=999",
              sectionParam = `section_id=${sectionId}` || "",
              fieldsParam = sidebar?.hasAttribute("enable-extended-search")
                ? "resources[options][fields]=author,body,product_type,tag,title,variants.barcode,variants.sku,variants.title,vendor"
                : "resources[options][fields]=title,product_type,variants.title,vendor";
            this.predictiveSearchAPI
              .get({
                searchQuery: queryKey,
                limitParam,
                sectionParam,
                fieldsParam,
              })
              .then((text) => {
                this.updateResultsFromHTML((0, dom_1.parseHTML)(text).body);
              })
              .catch(() => {
                console.log("Error in search component");
              });
          }
          updateResultsFromHTML(html) {
            const newSidebar = (0, utils_1.$el)(SEARCH_SIDEBAR_SELECTOR, html);
            let element;
            if (newSidebar) {
              const template = (0, utils_1.$el)(
                '[data-sidebar-template="SearchSidebar"]',
                newSidebar
              );
              element = (0, dom_1.getTemplateFirstChild)(template);
            } else element = html;
            const sidebar = (0, utils_1.$elParent)(
                SEARCH_SIDEBAR_SELECTOR,
                this
              ),
              newResults = (0, utils_1.$el)(CONTENT_RESULTS_SELECTOR, element),
              results = (0, utils_1.$el)(
                CONTENT_RESULTS_SELECTOR,
                sidebar?.element
              );
            (0, dom_1.replaceNodeChildren)(results, newResults),
              this.updateFooterVisible();
          }
          updateFooterVisible() {
            const sidebar = (0, utils_1.$elParent)(
              SEARCH_SIDEBAR_SELECTOR,
              this
            );
            if (sidebar) {
              const footer = (0, utils_1.$el)(FOOTER_SELECTOR, sidebar.element);
              if (footer) {
                const renderedItems = (0, utils_1.$list)(
                  ITEM_SELECTOR,
                  sidebar.element
                );
                footer.classList.toggle("hidden", renderedItems.length === 0);
              }
            }
          }
          get searchQuery() {
            const sidebar = (0, utils_1.$elParent)(
                SEARCH_SIDEBAR_SELECTOR,
                this
              ),
              searchField = (0, utils_1.$el)(SEARCH_FIELD_SELECTOR, sidebar);
            return searchField ? searchField.value.trim() : "";
          }
        }
        exports.SearchSidebarFormWrapper = SearchSidebarFormWrapper;
      },
      989: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SearchSidebar = void 0);
        const check_media_1 = __webpack_require__2(5580),
          sidebar_1 = __webpack_require__2(4622),
          utils_1 = __webpack_require__2(4083),
          SEARCH_INPUT_SELECTOR = "[data-sidebar-search-input]",
          CONTENT_SELECTOR = "[data-sidebar-search-content]",
          CONTENT_RESULTS_SELECTOR = "[data-sidebar-search-content-results]";
        class SearchSidebar extends sidebar_1.SidebarComponent {
          searchInput;
          resizeObserver;
          isInputFocused;
          defaultStateElement;
          constructor() {
            super(),
              (this.searchInput = (0, utils_1.$el)(
                SEARCH_INPUT_SELECTOR,
                this.element
              )),
              (this.defaultStateElement = this.element.cloneNode(!0));
          }
          mountComponent() {
            super.mountComponent();
            const content = (0, utils_1.$el)(CONTENT_SELECTOR, this.element),
              contentResults = (0, utils_1.$el)(
                CONTENT_RESULTS_SELECTOR,
                this.element
              );
            contentResults &&
              ((this.resizeObserver = new ResizeObserver(
                this.handleContentResultsResize
              )),
              this.resizeObserver.observe(contentResults)),
              this.addListener(content, "scroll", this.handleContentScroll),
              this.addListener(this, "click", this.handleClick),
              this.addListener(
                this,
                "touchend",
                this.handleSearchSidebarTouchEnd
              ),
              this.addListener(
                this.searchInput,
                "focus",
                this.handleInputFocus
              );
          }
          unmountComponent() {
            this.resizeObserver.disconnect(), super.unmountComponent();
          }
          handleClick = (event) => {
            const target = event.target,
              isInput = target === this.searchInput,
              queryElement = (0, utils_1.$elParent)(
                "[data-sidebar-search-query]",
                target
              );
            if (this.searchInput && queryElement) {
              const event2 = new Event("input", { bubbles: !0 });
              (this.searchInput.value = `${queryElement.getAttribute(
                "data-sidebar-search-query"
              )}`),
                this.searchInput.dispatchEvent(event2),
                this.searchInput.focus();
            }
            (0, check_media_1.isMobile)() &&
              isInput &&
              (this.isInputFocused = !0),
              !isInput && this.isInputFocused && (this.isInputFocused = !1);
          };
          handleInputFocus = () => {
            (0, check_media_1.isMobile)() && (this.isInputFocused = !0);
          };
          handleSearchSidebarTouchEnd = (event) => {
            const target = event.target,
              distanceX = Math.abs(this.touchStartX - this.touchEndX),
              distanceY = Math.abs(this.touchStartY - this.touchEndY),
              isOverThreshold = distanceX > 12 || distanceY > 12;
            this.isInputFocused &&
              isOverThreshold &&
              this.searchInput &&
              (target.tagName === "A" && event.preventDefault(),
              this.searchInput.blur(),
              (this.isInputFocused = !1)),
              this.cleanTouchPoints();
          };
          handleContentResultsResize = () => {
            this.toggleAttribute(
              "footer-shadow-visible",
              this.isContentOverlow()
            );
          };
          handleContentScroll = () => {
            const content = (0, utils_1.$el)(CONTENT_SELECTOR, this.element);
            content &&
              this.toggleAttribute(
                "header-shadow-visible",
                this.isContentOverlow() && content.scrollTop > 0
              );
          };
          async open(event) {
            await super.open(event),
              this.searchInput && !this.isEditor && this.searchInput.focus();
          }
          isContentOverlow() {
            const content = (0, utils_1.$el)(CONTENT_SELECTOR, this.element),
              contentResults = (0, utils_1.$el)(
                CONTENT_RESULTS_SELECTOR,
                this.element
              );
            return !contentResults || !content
              ? !1
              : contentResults.offsetHeight > content.offsetHeight;
          }
        }
        exports.SearchSidebar = SearchSidebar;
      },
      6361: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SlideshowComponent = void 0);
        var slideshow_1 = __webpack_require__2(8715);
        Object.defineProperty(exports, "SlideshowComponent", {
          enumerable: !0,
          get: function () {
            return slideshow_1.SlideshowComponent;
          },
        });
      },
      8715: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.SlideshowComponent = void 0);
        const base_component_1 = __webpack_require__2(3608),
          utils_1 = __webpack_require__2(4083),
          ANIMATE_IMAGES_ATTRIBUTE = "data-animate-images",
          SLIDE_ANIMATED_CLASSNAME = "slideshow__slide--animated";
        class SlideshowComponent extends base_component_1.BaseComponent {
          withImagesAnimated;
          constructor() {
            super(),
              (this.withImagesAnimated = this.hasAttribute(
                ANIMATE_IMAGES_ATTRIBUTE
              ));
          }
          mountComponent() {
            if (!this.withImagesAnimated) return;
            const carousel = (0, utils_1.$el)("carousel-component", this);
            carousel &&
              (carousel.embla
                .slideNodes()
                [carousel.embla.selectedScrollSnap()].classList.add(
                  SLIDE_ANIMATED_CLASSNAME
                ),
              carousel.embla.on("select", this.handleCarouselSelect));
          }
          handleCarouselSelect = (data) => {
            data
              .slideNodes()
              [data.previousScrollSnap()].classList.remove(
                SLIDE_ANIMATED_CLASSNAME
              ),
              data
                .slideNodes()
                [data.selectedScrollSnap()].classList.add(
                  SLIDE_ANIMATED_CLASSNAME
                );
          };
        }
        exports.SlideshowComponent = SlideshowComponent;
      },
      7121: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.VideoBanner = void 0);
        var video_banner_1 = __webpack_require__2(5809);
        Object.defineProperty(exports, "VideoBanner", {
          enumerable: !0,
          get: function () {
            return video_banner_1.VideoBanner;
          },
        });
      },
      5809: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.VideoBanner = void 0);
        const utils_1 = __webpack_require__2(4083),
          base_component_1 = __webpack_require__2(3608),
          BANNER_POSTER_SELECTOR = "[data-video-banner-poster]";
        class VideoBanner extends base_component_1.BaseComponent {
          isControlsEnabled;
          isAutoplayEnabled;
          constructor() {
            super(),
              (this.isControlsEnabled = this.hasAttribute(
                "data-enable-controls"
              )),
              (this.isAutoplayEnabled = this.hasAttribute(
                "data-enable-autoplay"
              ));
          }
          mountComponent() {
            this.isAutoplayEnabled && this.loadContent(),
              this.addListener(this, "click", this.handleClick);
          }
          handleClick = (event) => {
            const video = (0, utils_1.$elParent)("video", event.target),
              poster = (0, utils_1.$elParent)(
                BANNER_POSTER_SELECTOR,
                event.target
              );
            if (video) {
              const video2 = event.target;
              !this.isControlsEnabled &&
                video2 &&
                (video2.paused ? video2.play() : video2.pause());
            }
            poster && this.loadContent();
          };
          loadContent() {
            this.getAttribute("loaded") ||
              (this.addVideo(), this.setAttribute("loaded", "true"));
          }
          removeVideo() {
            const video = (0, utils_1.$el)("video,  iframe", this);
            video && (video.remove(), this.removeAttribute("loaded"));
          }
          addVideo() {
            const content = document.createElement("div"),
              templateContent = (0, utils_1.$el)(
                "[data-video-banner-media-template]",
                this
              )?.content,
              container = (0, utils_1.$el)(
                "[data-video-banner-container]",
                this
              );
            if (!templateContent || !templateContent.firstElementChild) return;
            const firstChild = templateContent.firstElementChild.cloneNode(!0);
            content.appendChild(firstChild);
            const video = (0, utils_1.$el)("video, iframe", content);
            if (!video) return;
            const poster = (0, utils_1.$el)(BANNER_POSTER_SELECTOR, this);
            poster && poster.remove(),
              container.appendChild(video),
              video.tagName === "VIDEO" && video.play();
          }
        }
        exports.VideoBanner = VideoBanner;
      },
      5580: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.checkAnimationReduce = exports.isMobile = void 0);
        const isMobile = () => matchMedia("(max-width: 568px)").matches;
        exports.isMobile = isMobile;
        const checkAnimationReduce = () =>
          matchMedia("(prefers-reduced-motion: reduce)").matches;
        exports.checkAnimationReduce = checkAnimationReduce;
      },
      7734: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.hexToColorName = exports.colorNameToHex = void 0);
        const colorNames = {
            aliceblue: "#f0f8ff",
            antiquewhite: "#faebd7",
            aqua: "#00ffff",
            aquamarine: "#7fffd4",
            azure: "#f0ffff",
            beige: "#f5f5dc",
            bisque: "#ffe4c4",
            black: "#000000",
            blanchedalmond: "#ffebcd",
            blue: "#0000ff",
            blueviolet: "#8a2be2",
            brown: "#a52a2a",
            burlywood: "#deb887",
            cadetblue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            cornflowerblue: "#6495ed",
            cornsilk: "#fff8dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkblue: "#00008b",
            darkcyan: "#008b8b",
            darkgoldenrod: "#b8860b",
            darkgray: "#a9a9a9",
            darkgreen: "#006400",
            darkkhaki: "#bdb76b",
            darkmagenta: "#8b008b",
            darkolivegreen: "#556b2f",
            darkorange: "#ff8c00",
            darkorchid: "#9932cc",
            darkred: "#8b0000",
            darksalmon: "#e9967a",
            darkseagreen: "#8fbc8f",
            darkslateblue: "#483d8b",
            darkslategray: "#2f4f4f",
            darkturquoise: "#00ced1",
            darkviolet: "#9400d3",
            deeppink: "#ff1493",
            deepskyblue: "#00bfff",
            dimgray: "#696969",
            dodgerblue: "#1e90ff",
            firebrick: "#b22222",
            floralwhite: "#fffaf0",
            forestgreen: "#228b22",
            fuchsia: "#ff00ff",
            gainsboro: "#dcdcdc",
            ghostwhite: "#f8f8ff",
            gold: "#ffd700",
            goldenrod: "#daa520",
            gray: "#808080",
            green: "#008000",
            greenyellow: "#adff2f",
            honeydew: "#f0fff0",
            hotpink: "#ff69b4",
            indianred: "#cd5c5c",
            indigo: "#4b0082",
            ivory: "#fffff0",
            khaki: "#f0e68c",
            lavender: "#e6e6fa",
            lavenderblush: "#fff0f5",
            lawngreen: "#7cfc00",
            lemonchiffon: "#fffacd",
            lightblue: "#add8e6",
            lightcoral: "#f08080",
            lightcyan: "#e0ffff",
            lightgoldenrodyellow: "#fafad2",
            lightgrey: "#d3d3d3",
            lightgreen: "#90ee90",
            lightpink: "#ffb6c1",
            lightsalmon: "#ffa07a",
            lightseagreen: "#20b2aa",
            lightskyblue: "#87cefa",
            lightslategray: "#778899",
            lightsteelblue: "#b0c4de",
            lightyellow: "#ffffe0",
            lime: "#00ff00",
            limegreen: "#32cd32",
            linen: "#faf0e6",
            magenta: "#ff00ff",
            maroon: "#800000",
            mediumaquamarine: "#66cdaa",
            mediumblue: "#0000cd",
            mediumorchid: "#ba55d3",
            mediumpurple: "#9370d8",
            mediumseagreen: "#3cb371",
            mediumslateblue: "#7b68ee",
            mediumspringgreen: "#00fa9a",
            mediumturquoise: "#48d1cc",
            mediumvioletred: "#c71585",
            midnightblue: "#191970",
            mintcream: "#f5fffa",
            mistyrose: "#ffe4e1",
            moccasin: "#ffe4b5",
            navajowhite: "#ffdead",
            navy: "#000080",
            oldlace: "#fdf5e6",
            olive: "#808000",
            olivedrab: "#6b8e23",
            orange: "#ffa500",
            orangered: "#ff4500",
            orchid: "#da70d6",
            palegoldenrod: "#eee8aa",
            palegreen: "#98fb98",
            paleturquoise: "#afeeee",
            palevioletred: "#d87093",
            papayawhip: "#ffefd5",
            peachpuff: "#ffdab9",
            peru: "#cd853f",
            pink: "#ffc0cb",
            plum: "#dda0dd",
            powderblue: "#b0e0e6",
            purple: "#800080",
            rebeccapurple: "#663399",
            red: "#ff0000",
            rosybrown: "#bc8f8f",
            royalblue: "#4169e1",
            saddlebrown: "#8b4513",
            salmon: "#fa8072",
            sandybrown: "#f4a460",
            seagreen: "#2e8b57",
            seashell: "#fff5ee",
            sienna: "#a0522d",
            silver: "#c0c0c0",
            skyblue: "#87ceeb",
            slateblue: "#6a5acd",
            slategray: "#708090",
            snow: "#fffafa",
            springgreen: "#00ff7f",
            steelblue: "#4682b4",
            tan: "#d2b48c",
            teal: "#008080",
            thistle: "#d8bfd8",
            tomato: "#ff6347",
            turquoise: "#40e0d0",
            violet: "#ee82ee",
            wheat: "#f5deb3",
            white: "#ffffff",
            whitesmoke: "#f5f5f5",
            yellow: "#ffff00",
            yellowgreen: "#9acd32",
          },
          colorHexs = Object.keys(colorNames).reduce(
            (acc, key) => ({ ...acc, [colorNames[key]]: key }),
            {}
          ),
          colorNameToHex = (color) => colorNames[color.toLowerCase()];
        exports.colorNameToHex = colorNameToHex;
        const hexToColorName = (hex) => colorHexs[hex];
        exports.hexToColorName = hexToColorName;
      },
      3036: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.KEY_CONSTS = exports.SHOPIFY_EVENTS = void 0),
          (exports.SHOPIFY_EVENTS = {
            SECTION_LOAD: "shopify:section:load",
            SECTION_UNLOAD: "shopify:section:unload",
            SECTION_SELECT: "shopify:section:select",
            SECTION_DESELECT: "shopify:section:deselect",
            SECTION_REORDER: "shopify:section:reorder",
            BLOCK_SELECT: "shopify:block:select",
            BLOCK_DESELECT: "shopify:block:deselect",
          }),
          (exports.KEY_CONSTS = {
            ARROW_LEFT_STRING_KEY: "ArrowLeft",
            ARROW_RIGHT_STRING_KEY: "ArrowRight",
            ARROW_LEFT_NUMBER_KEY: 37,
            ARROW_RIGHT_NUMBER_KEY: 39,
            ENTER_STRING_KEY: "Enter",
            ENTER_NUMBER_KEY: 13,
            ESCAPE_STRING_KEY: "Escape",
            ESCAPE_NUMBER_KEY: 27,
            SPACE_STRING_KEY: " ",
            SPACE_NUMBER_KEY: 32,
            TAB_STRING_KEY: "Tab",
            TAB_NUMBER_KEY: 9,
          });
      },
      2731: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.debounce = void 0);
        const debounce = (fn, wait) => {
          let t;
          return (...args) => {
            clearTimeout(t), (t = setTimeout(() => fn.apply(this, args), wait));
          };
        };
        exports.debounce = debounce;
      },
      3626: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.defineComponents = void 0);
        const featured_navigation_1 = __webpack_require__2(8432),
          accordeon_1 = __webpack_require__2(7606),
          accordeon_2 = __webpack_require__2(4604),
          back_to_top_button_1 = __webpack_require__2(1521),
          body_element_1 = __webpack_require__2(3831),
          horizontal_product_card_1 = __webpack_require__2(1058),
          product_card_1 = __webpack_require__2(6978),
          product_card_color_swatches_1 = __webpack_require__2(5705),
          product_card_media_tabs_1 = __webpack_require__2(7195),
          vertical_product_card_1 = __webpack_require__2(3505),
          carousel_1 = __webpack_require__2(9691),
          slideshow_1 = __webpack_require__2(6361),
          cart_count_1 = __webpack_require__2(3492),
          cart_notification_1 = __webpack_require__2(1070),
          clipboard_button_1 = __webpack_require__2(9911),
          collapsed_tags_1 = __webpack_require__2(3210),
          article_card_1 = __webpack_require__2(8616),
          countdown_timer_1 = __webpack_require__2(5950),
          deffered_media_1 = __webpack_require__2(7230),
          float_element_1 = __webpack_require__2(1279),
          free_shipping_bar_1 = __webpack_require__2(8430),
          inputs_1 = __webpack_require__2(1027),
          localization_selector_1 = __webpack_require__2(758),
          max_lines_truncate_1 = __webpack_require__2(436),
          modal_1 = __webpack_require__2(1181),
          modal_2 = __webpack_require__2(2549),
          notification_1 = __webpack_require__2(4061),
          pagination_1 = __webpack_require__2(6504),
          pagination_2 = __webpack_require__2(3223),
          quantity_input_1 = __webpack_require__2(4710),
          quantity_1 = __webpack_require__2(1176),
          shape_swatch_1 = __webpack_require__2(7317),
          share_1 = __webpack_require__2(3533),
          sidebar_1 = __webpack_require__2(6426),
          sidebar_2 = __webpack_require__2(4622),
          sticky_cart_button_1 = __webpack_require__2(5285),
          tabs_1 = __webpack_require__2(1167),
          tab_1 = __webpack_require__2(3722),
          tabs_2 = __webpack_require__2(7812),
          before_after_images_1 = __webpack_require__2(7126),
          cart_1 = __webpack_require__2(1636),
          cart_drawer_1 = __webpack_require__2(9223),
          cart_2 = __webpack_require__2(1678),
          collection_page_1 = __webpack_require__2(3389),
          sort_list_1 = __webpack_require__2(8590),
          customer_1 = __webpack_require__2(4570),
          faq_1 = __webpack_require__2(8563),
          header_1 = __webpack_require__2(9300),
          hotspots_1 = __webpack_require__2(3891),
          lookbook_1 = __webpack_require__2(5374),
          map_1 = __webpack_require__2(2262),
          map_component_1 = __webpack_require__2(6942),
          password_page_1 = __webpack_require__2(4504),
          popups_1 = __webpack_require__2(4997),
          product_1 = __webpack_require__2(9193),
          product_recommendations_1 = __webpack_require__2(6368),
          product_modal_image_wrap_1 = __webpack_require__2(5066),
          product_model_1 = __webpack_require__2(2913),
          quick_view_1 = __webpack_require__2(4218),
          recently_viewed_1 = __webpack_require__2(766),
          scrolling_text_1 = __webpack_require__2(1796),
          search_drawer_1 = __webpack_require__2(9728),
          video_banner_1 = __webpack_require__2(7121),
          utils_1 = __webpack_require__2(4083),
          image_slider_1 = __webpack_require__2(9239),
          close_cursor_1 = __webpack_require__2(5370),
          quote_1 = __webpack_require__2(1030),
          testimonials_1 = __webpack_require__2(4736),
          lazy_video_1 = __webpack_require__2(8659),
          header_float_element_btn_1 = __webpack_require__2(4732),
          header_float_element_1 = __webpack_require__2(6308),
          product_info_1 = __webpack_require__2(5089),
          slider_grid_1 = __webpack_require__2(7300),
          components = [
            header_float_element_btn_1.HeaderFloatElementBtn,
            header_float_element_1.HeaderFloatElement,
            lazy_video_1.LazyVideo,
            back_to_top_button_1.BackToTopButton,
            sticky_cart_button_1.StickyCartButton,
            quantity_1.QuantityComponent,
            quantity_input_1.QuantityBtn,
            localization_selector_1.LocalizationSelector,
            notification_1.NotificationComponent,
            tabs_2.TabsComponent,
            tab_1.TabComponent,
            collection_page_1.ListComponent,
            collection_page_1.ListBtn,
            float_element_1.FloatElement,
            hotspots_1.HotspotsFloatElement,
            hotspots_1.HotspotsComponent,
            float_element_1.FloatElementBtn,
            float_element_1.DropdownOpener,
            float_element_1.TooltipTrigger,
            faq_1.FaqSection,
            accordeon_2.AccordeonComponent,
            accordeon_1.AccordeonButton,
            product_card_media_tabs_1.ProductMediaTabs,
            product_card_color_swatches_1.ColorSwatches,
            modal_2.ModalComponent,
            password_page_1.PasswordModal,
            password_page_1.PasswordModalButton,
            cart_notification_1.CartNotificationPopup,
            modal_1.ModalButton,
            sidebar_1.SidebarButton,
            sidebar_2.SidebarComponent,
            search_drawer_1.SearchSidebar,
            search_drawer_1.SearchSidebarFormWrapper,
            quick_view_1.QuickView,
            carousel_1.CarouselComponent,
            carousel_1.CarouselPlayButton,
            carousel_1.CarouselDots,
            carousel_1.CarouselButton,
            carousel_1.CarouselProgress,
            slideshow_1.SlideshowComponent,
            header_1.HeaderComponent,
            header_1.DrawerMenu,
            header_1.DrawerMenuPage,
            header_1.DrawerMenuPageLink,
            pagination_2.PaginationComponent,
            pagination_1.PaginationLoadButton,
            pagination_1.PaginationLink,
            pagination_1.PaginationInfiniteScroll,
            deffered_media_1.DeferredMedia,
            product_1.PickupAvailability,
            product_1.ProductForm,
            product_1.ProductFormButton,
            product_1.ProductDetails,
            product_1.ProductBlock,
            product_model_1.ProductModel,
            cart_2.CartPage,
            cart_drawer_1.CartDrawer,
            cart_drawer_1.CartDrawerItemsBlock,
            cart_drawer_1.CartDrawerInCartBannerBlock,
            cart_drawer_1.CartDrawerRelatedProducts,
            cart_drawer_1.CartDrawerRelatedProductsBlock,
            cart_drawer_1.CartDrawerTimerBlock,
            cart_drawer_1.CartDrawerHeader,
            cart_drawer_1.CartDrawerFooter,
            cart_drawer_1.CartDrawerFreeShippingBarBlock,
            cart_drawer_1.CartDrawerButtonsBlock,
            free_shipping_bar_1.FreeShippingBar,
            product_1.ProductContent,
            product_1.ProductMedia,
            product_1.ProductMediaCarousel,
            product_1.VariantPicker,
            product_1.ColorSwatchesPicker,
            product_1.ProductModal,
            product_modal_image_wrap_1.ProductModalImageWrap,
            product_1.ProductModalButton,
            product_recommendations_1.ProductRecommendations,
            product_1.ProductRelatedBlock,
            recently_viewed_1.RecentlyViewed,
            clipboard_button_1.ClipboardButton,
            clipboard_button_1.ClipboardButtonTooltip,
            product_card_1.ProductCard,
            horizontal_product_card_1.HorizontalProductCard,
            vertical_product_card_1.VerticalProductCard,
            max_lines_truncate_1.MaxLinesComponent,
            inputs_1.SearchField,
            inputs_1.PasswordField,
            product_1.ZoomCursor,
            collection_page_1.ShopComponent,
            collection_page_1.ShopActiveFilters,
            collection_page_1.SidebarFiltersDesktop,
            collection_page_1.SidebarFiltersMobile,
            collection_page_1.FilterRemoveBtn,
            sort_list_1.SortList,
            collection_page_1.PriceRange,
            collection_page_1.ColumnSwitcher,
            collection_page_1.FiltersSubmitBtn,
            before_after_images_1.BeforeAfterImages,
            countdown_timer_1.CountdownTimer,
            product_1.ProductInformationDrawer,
            collection_page_1.SidebarFiltersStickyMobileButton,
            product_1.RecipientForm,
            shape_swatch_1.ShapeSwatch,
            customer_1.CountrySelector,
            customer_1.LoginComponent,
            customer_1.RegisterComponent,
            customer_1.AddressesComponent,
            tabs_1.TabWithDynamicHeight,
            video_banner_1.VideoBanner,
            cart_1.CartItem,
            cart_1.CartRemoveButton,
            cart_1.CartItemsBlock,
            cart_1.CartButtonsBlock,
            cart_1.CartCountdownBlock,
            cart_1.CartRelatedProductsBlock,
            cart_1.CartOrderNotesBlock,
            cart_1.CartNote,
            cart_1.CartAppBlock,
            cart_1.CartSubtotalBlock,
            cart_1.CartInCartBannerBlock,
            cart_1.CartFreeShippingBarBlock,
            cart_1.CartRelatedProducts,
            cart_count_1.CartCount,
            share_1.ShareWrapper,
            share_1.ShareComponent,
            scrolling_text_1.ScrollingText,
            scrolling_text_1.ScrollingTextLine,
            collapsed_tags_1.CollapsedTags,
            article_card_1.ArticleTags,
            popups_1.PopupAgeVerifier,
            popups_1.PopupPromo,
            popups_1.PopupSignup,
            popups_1.PopupTeaser,
            lookbook_1.LookbookComponent,
            lookbook_1.LookbookModal,
            map_component_1.MapComponent,
            map_1.StoreLocator,
            body_element_1.BodyElement,
            featured_navigation_1.FeaturedNavigation,
            image_slider_1.ImageSlider,
            close_cursor_1.CloseCursor,
            quote_1.QuoteComponent,
            testimonials_1.TestimonialsComponent,
            product_info_1.ProductInfo,
            slider_grid_1.SliderGrid,
          ];
        window.recentlyViewed = recently_viewed_1.RecentlyViewed;
        const defineComponents = () => {
          components.forEach(utils_1.registerComponent);
        };
        exports.defineComponents = defineComponents;
      },
      3889: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.replaceNodeChildren =
            exports.parseHTML =
            exports.skipTransition =
            exports.removeStyleVariable =
            exports.setStyleVariable =
            exports.getTemplateFirstChild =
            exports.getTemplateContent =
            exports.getStylePropValue =
            exports.hideElement =
            exports.showElement =
              void 0);
        const showElement = (element) => {
          element && element.classList.remove("hidden");
        };
        exports.showElement = showElement;
        const hideElement = (element) => {
          element && element.classList.add("hidden");
        };
        exports.hideElement = hideElement;
        const getStylePropValue = (element, property) =>
          getComputedStyle(element)[property];
        exports.getStylePropValue = getStylePropValue;
        const getTemplateContent = (template) => template.content.cloneNode(!0);
        exports.getTemplateContent = getTemplateContent;
        const getTemplateFirstChild = (template) =>
          template?.content.firstElementChild.cloneNode(!0);
        exports.getTemplateFirstChild = getTemplateFirstChild;
        const setStyleVariable = (variable, value) => {
          document.documentElement.style.setProperty(
            `--gsc-${variable}`,
            value
          );
        };
        exports.setStyleVariable = setStyleVariable;
        const removeStyleVariable = (variable) => {
          document.documentElement.style.removeProperty(`--gsc-${variable}`);
        };
        exports.removeStyleVariable = removeStyleVariable;
        const skipTransition = (element, isForward) => {
          element && element.classList.toggle("forward-transition", isForward);
        };
        exports.skipTransition = skipTransition;
        const parseHTML = (html) =>
          new DOMParser().parseFromString(html, "text/html");
        exports.parseHTML = parseHTML;
        const replaceNodeChildren = (node, newNode) => {
          newNode &&
            node &&
            node.replaceChildren(...newNode.cloneNode(!0).childNodes);
        };
        exports.replaceNodeChildren = replaceNodeChildren;
      },
      8548: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.fetchConfig = void 0);
        const fetchConfig = (type = "json") => ({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: `application/${type}`,
          },
        });
        exports.fetchConfig = fetchConfig;
      },
      9331: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.IntervalTimer = void 0);
        const STATE = {
          idle: "idle",
          running: "running",
          paused: "paused",
          resumed: "resumed",
        };
        class IntervalTimer {
          state = STATE.idle;
          pausedTime = 0;
          remainingTime = 0;
          lastFireTime;
          lastPauseTime;
          callback;
          interval;
          timerId;
          resumeId;
          constructor(callback, interval) {
            (this.interval = interval), (this.callback = callback);
          }
          proxyCallback() {
            (this.lastFireTime = new Date().valueOf()), this.callback();
          }
          start() {
            (this.timerId = setInterval(
              () => this.proxyCallback(),
              this.interval
            )),
              (this.lastFireTime = new Date().valueOf()),
              (this.state = STATE.running);
          }
          pause() {
            (this.state !== STATE.running && this.state !== STATE.resumed) ||
              ((this.remainingTime =
                this.interval -
                (new Date().valueOf() - this.lastFireTime) +
                this.pausedTime),
              (this.lastPauseTime = new Date().valueOf()),
              clearInterval(this.timerId),
              clearTimeout(this.resumeId),
              (this.state = STATE.paused));
          }
          resume() {
            this.state === STATE.paused &&
              ((this.pausedTime += new Date().valueOf() - this.lastPauseTime),
              (this.state = STATE.resumed),
              (this.resumeId = setTimeout(
                () => this.timeoutCallback(),
                this.remainingTime
              )));
          }
          timeoutCallback() {
            this.state === STATE.resumed &&
              ((this.pausedTime = 0), this.proxyCallback(), this.start());
          }
          stop() {
            this.state !== STATE.idle &&
              (clearInterval(this.timerId),
              clearTimeout(this.resumeId),
              (this.state = STATE.idle));
          }
          setInterval(newInterval) {
            this.state === STATE.running
              ? (this.pause(), (this.interval = newInterval), this.resume())
              : (this.interval = newInterval);
          }
        }
        exports.IntervalTimer = IntervalTimer;
      },
      9650: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.isTabKey =
            exports.isLeftKey =
            exports.isRightKey =
            exports.isEscKey =
            exports.isSpaceKey =
            exports.isEnterKey =
              void 0);
        const constants_1 = __webpack_require__2(3036),
          isEnterKey = (event) => {
            const key = event.key || event.keyCode;
            return (
              key === constants_1.KEY_CONSTS.ENTER_NUMBER_KEY ||
              key === constants_1.KEY_CONSTS.ENTER_STRING_KEY
            );
          };
        exports.isEnterKey = isEnterKey;
        const isSpaceKey = (event) => {
          const key = event.key || event.keyCode;
          return (
            key === constants_1.KEY_CONSTS.SPACE_NUMBER_KEY ||
            key === constants_1.KEY_CONSTS.SPACE_STRING_KEY
          );
        };
        exports.isSpaceKey = isSpaceKey;
        const isEscKey = (event) => {
          const key = event.key || event.keyCode;
          return (
            key === constants_1.KEY_CONSTS.ESCAPE_STRING_KEY ||
            key === constants_1.KEY_CONSTS.ESCAPE_NUMBER_KEY
          );
        };
        exports.isEscKey = isEscKey;
        const isRightKey = (event) => {
          const key = event.key || event.keyCode;
          return (
            key === constants_1.KEY_CONSTS.ARROW_RIGHT_NUMBER_KEY ||
            key === constants_1.KEY_CONSTS.ARROW_RIGHT_STRING_KEY
          );
        };
        exports.isRightKey = isRightKey;
        const isLeftKey = (event) => {
          const key = event.key || event.keyCode;
          return (
            key === constants_1.KEY_CONSTS.ARROW_LEFT_NUMBER_KEY ||
            key === constants_1.KEY_CONSTS.ARROW_LEFT_STRING_KEY
          );
        };
        exports.isLeftKey = isLeftKey;
        const isTabKey = (event) => {
          const key = event.key || event.keyCode;
          return (
            key === constants_1.KEY_CONSTS.TAB_NUMBER_KEY ||
            key === constants_1.KEY_CONSTS.TAB_STRING_KEY
          );
        };
        exports.isTabKey = isTabKey;
      },
      7322: function (__unused_webpack_module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.getTransitionInfo = exports.whenTransitionEnds = void 0);
        const TRANSITION = "transition",
          ANIMATION = "animation",
          transitionEndEvent = "transitionend",
          animationEndEvent = "animationend",
          animationFrameLength = Math.ceil(1e3 / 60),
          noop = () => {};
        function whenTransitionEnds(el, cb) {
          const { type, timeout, propCount } = getTransitionInfo(el);
          if (!type) return cb(), noop;
          const eventType =
            type === TRANSITION ? transitionEndEvent : animationEndEvent;
          let ended = 0,
            timeoutId = null;
          const cleanup = () => {
              timeoutId && (window.clearTimeout(timeoutId), (timeoutId = null)),
                el.removeEventListener(eventType, onEnd);
            },
            end = () => {
              cleanup(), cb();
            },
            onEnd = (e) => {
              e.target === el && ++ended >= propCount && end();
            };
          return (
            (timeoutId = window.setTimeout(() => {
              ended < propCount && end();
            }, timeout + animationFrameLength)),
            el.addEventListener(eventType, onEnd),
            () => cleanup()
          );
        }
        exports.whenTransitionEnds = whenTransitionEnds;
        function getTransitionInfo(el) {
          const styles = window.getComputedStyle(el),
            transitionDelays = (styles.transitionDelay || "").split(", "),
            transitionDurations = (styles.transitionDuration || "").split(", "),
            transitionTimeout = getTimeout(
              transitionDelays,
              transitionDurations
            ),
            animationDelays = (styles.animationDelay || "").split(", "),
            animationDurations = (styles.animationDuration || "").split(", "),
            animationTimeout = getTimeout(animationDelays, animationDurations),
            timeout = Math.max(transitionTimeout, animationTimeout),
            type =
              timeout > 0
                ? transitionTimeout > animationTimeout
                  ? TRANSITION
                  : ANIMATION
                : null,
            propCount = type
              ? type === TRANSITION
                ? transitionDurations.length
                : animationDurations.length
              : 0;
          return { type, timeout, propCount };
        }
        exports.getTransitionInfo = getTransitionInfo;
        function getTimeout(delays, durations) {
          for (; delays.length < durations.length; )
            delays = delays.concat(delays);
          return Math.max.apply(
            null,
            durations.map((d, i) => toMs(d) + toMs(delays[i]))
          );
        }
        function toMs(s) {
          return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
        }
      },
      4083: function (__unused_webpack_module, exports, __webpack_require__2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: !0 }),
          (exports.stripHtml =
            exports.isNotThemeStore =
            exports.isNotIframe =
            exports.$elParent =
            exports.$list =
            exports.$el =
            exports.transitionToPromise =
            exports.whenDefined =
            exports.registerComponent =
            exports.upperCamelCaseToSnakeCase =
            exports.createPrefetchLink =
            exports.isCurrentPageLink =
            exports.isExternalLink =
            exports.createPortal =
            exports.isSafari =
            exports.removeCustomElementFromBody =
            exports.appendElementToBody =
            exports.getTargets =
            exports.getFocusTargets =
            exports.viewportObserver =
            exports.delay =
            exports.capitalize =
              void 0);
        const transition_util_1 = __webpack_require__2(7322),
          capitalize = (word) => {
            const firstSymbol = word.slice(0, 1),
              restWordPart = word.slice(1);
            return firstSymbol.toUpperCase() + restWordPart;
          };
        exports.capitalize = capitalize;
        const delay = (delay2 = 0) =>
          new Promise((resolve, reject) => {
            setTimeout(resolve, delay2);
          });
        (exports.delay = delay),
          (exports.viewportObserver = new IntersectionObserver((entries, _) => {
            entries.forEach((entry) => {
              const isInViewport = entry.isIntersecting,
                isParentHidden = entry.target.closest(
                  '[aria-hidden="true"], .hidden'
                );
              entry.target.classList.toggle(
                "is-in-viewport",
                isInViewport && !isParentHidden
              );
            });
          }));
        const getFocusTargets = () =>
          [
            "button:enabled",
            "input:not([type=hidden]):enabled",
            "textarea:enabled",
            "a[href]",
            "[data-focus-trap-target]",
            '[tabindex]:not([tabindex^="-"])',
          ]
            .map(
              (target) =>
                `${target}:not([data-color-swatches-hidden-count]:empty):not(.hidden)`
            )
            .join(",");
        exports.getFocusTargets = getFocusTargets;
        const getTargets = (element, withCarouselButtons = !0) => {
          const targets = (0, exports.$list)(
              (0, exports.getFocusTargets)(),
              element
            ).filter((target) =>
              withCarouselButtons
                ? target.clientWidth > 0
                : target.clientWidth > 0 &&
                  !target.hasAttribute("data-direction")
            ),
            firstTarget = targets[0],
            lastTarget = targets[targets.length - 1];
          return { targets, firstTarget, lastTarget };
        };
        exports.getTargets = getTargets;
        const appendElementToBody = (customElement) => {
          const customElementContainer = document.createElement("div");
          return (
            customElementContainer.classList.add("hidden"),
            document.body.appendChild(customElementContainer),
            customElementContainer.appendChild(customElement),
            customElementContainer
          );
        };
        exports.appendElementToBody = appendElementToBody;
        const removeCustomElementFromBody = (customElementContainer) => {
          customElementContainer.remove();
        };
        exports.removeCustomElementFromBody = removeCustomElementFromBody;
        const isSafari = () => /apple/i.test(navigator.vendor);
        exports.isSafari = isSafari;
        const createPortal = (children, parent) => {
          let element = (0, exports.$el)("#Portal");
          element.appendChild(children),
            (parent && parent.appendChild ? parent : document.body).appendChild(
              element
            );
        };
        exports.createPortal = createPortal;
        const isExternalLink = (href) =>
          !href.match(/^\//) && !href.includes(window.location.host);
        exports.isExternalLink = isExternalLink;
        const isCurrentPageLink = (href) => href === window.location.href;
        exports.isCurrentPageLink = isCurrentPageLink;
        const createPrefetchLink = (href) => {
          const link = document.createElement("link");
          link.setAttribute("rel", "prefetch"),
            link.setAttribute("href", href),
            document.head.appendChild(link);
        };
        exports.createPrefetchLink = createPrefetchLink;
        const upperCamelCaseToSnakeCase = (value) =>
          value
            .replace(/^([A-Z])/, ($1) => $1.toLowerCase())
            .replace(/([A-Z])/g, ($1) => "-" + $1.toLowerCase());
        exports.upperCamelCaseToSnakeCase = upperCamelCaseToSnakeCase;
        const registerComponent = (componentClass) => {
          try {
            const name = (0, exports.upperCamelCaseToSnakeCase)(
              componentClass.name
            );
            customElements.define(name, componentClass);
          } catch {
            console.log(`${componentClass} has not been defined`);
          }
        };
        exports.registerComponent = registerComponent;
        const whenDefined = (componentTag) =>
          customElements.whenDefined(componentTag);
        exports.whenDefined = whenDefined;
        const transitionToPromise = (el) =>
          new Promise((resolve) => {
            (0, transition_util_1.whenTransitionEnds)(el, () => {
              resolve(null);
            });
          });
        exports.transitionToPromise = transitionToPromise;
        const $el = (selector, scope = document) =>
          scope.querySelector(selector);
        exports.$el = $el;
        const $list = (selector, scope = document) => [
          ...scope.querySelectorAll(selector),
        ];
        exports.$list = $list;
        const $elParent = (selector, scope = document) =>
          scope.closest(selector);
        exports.$elParent = $elParent;
        const isNotIframe = () => window.self === window.top;
        exports.isNotIframe = isNotIframe;
        const isNotThemeStore = () =>
          window.self === window.top || Shopify.designMode;
        exports.isNotThemeStore = isNotThemeStore;
        const stripHtml = (html) => {
          let tmp = document.createElement("DIV");
          return (tmp.innerHTML = html), tmp.textContent || tmp.innerText || "";
        };
        exports.stripHtml = stripHtml;
      },
      7582: function (
        __unused_webpack___webpack_module__,
        __webpack_exports__2,
        __webpack_require__2
      ) {
        "use strict";
        __webpack_require__2.r(__webpack_exports__2),
          __webpack_require__2.d(__webpack_exports__2, {
            __addDisposableResource: function () {
              return __addDisposableResource;
            },
            __assign: function () {
              return __assign;
            },
            __asyncDelegator: function () {
              return __asyncDelegator;
            },
            __asyncGenerator: function () {
              return __asyncGenerator;
            },
            __asyncValues: function () {
              return __asyncValues;
            },
            __await: function () {
              return __await;
            },
            __awaiter: function () {
              return __awaiter;
            },
            __classPrivateFieldGet: function () {
              return __classPrivateFieldGet;
            },
            __classPrivateFieldIn: function () {
              return __classPrivateFieldIn;
            },
            __classPrivateFieldSet: function () {
              return __classPrivateFieldSet;
            },
            __createBinding: function () {
              return __createBinding;
            },
            __decorate: function () {
              return __decorate;
            },
            __disposeResources: function () {
              return __disposeResources;
            },
            __esDecorate: function () {
              return __esDecorate;
            },
            __exportStar: function () {
              return __exportStar;
            },
            __extends: function () {
              return __extends;
            },
            __generator: function () {
              return __generator;
            },
            __importDefault: function () {
              return __importDefault;
            },
            __importStar: function () {
              return __importStar;
            },
            __makeTemplateObject: function () {
              return __makeTemplateObject;
            },
            __metadata: function () {
              return __metadata;
            },
            __param: function () {
              return __param;
            },
            __propKey: function () {
              return __propKey;
            },
            __read: function () {
              return __read;
            },
            __rest: function () {
              return __rest;
            },
            __runInitializers: function () {
              return __runInitializers;
            },
            __setFunctionName: function () {
              return __setFunctionName;
            },
            __spread: function () {
              return __spread;
            },
            __spreadArray: function () {
              return __spreadArray;
            },
            __spreadArrays: function () {
              return __spreadArrays;
            },
            __values: function () {
              return __values;
            },
          });
        var extendStatics = function (d, b) {
          return (
            (extendStatics =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function (d2, b2) {
                  d2.__proto__ = b2;
                }) ||
              function (d2, b2) {
                for (var p in b2)
                  Object.prototype.hasOwnProperty.call(b2, p) &&
                    (d2[p] = b2[p]);
              }),
            extendStatics(d, b)
          );
        };
        function __extends(d, b) {
          if (typeof b != "function" && b !== null)
            throw new TypeError(
              "Class extends value " +
                String(b) +
                " is not a constructor or null"
            );
          extendStatics(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype =
            b === null
              ? Object.create(b)
              : ((__.prototype = b.prototype), new __());
        }
        var __assign = function () {
          return (
            (__assign =
              Object.assign ||
              function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                  s = arguments[i];
                  for (var p in s)
                    Object.prototype.hasOwnProperty.call(s, p) && (t[p] = s[p]);
                }
                return t;
              }),
            __assign.apply(this, arguments)
          );
        };
        function __rest(s, e) {
          var t = {};
          for (var p in s)
            Object.prototype.hasOwnProperty.call(s, p) &&
              e.indexOf(p) < 0 &&
              (t[p] = s[p]);
          if (s != null && typeof Object.getOwnPropertySymbols == "function")
            for (
              var i = 0, p = Object.getOwnPropertySymbols(s);
              i < p.length;
              i++
            )
              e.indexOf(p[i]) < 0 &&
                Object.prototype.propertyIsEnumerable.call(s, p[i]) &&
                (t[p[i]] = s[p[i]]);
          return t;
        }
        function __decorate(decorators, target, key, desc) {
          var c = arguments.length,
            r =
              c < 3
                ? target
                : desc === null
                ? (desc = Object.getOwnPropertyDescriptor(target, key))
                : desc,
            d;
          if (
            typeof Reflect == "object" &&
            typeof Reflect.decorate == "function"
          )
            r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              (d = decorators[i]) &&
                (r =
                  (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) ||
                  r);
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        }
        function __param(paramIndex, decorator) {
          return function (target, key) {
            decorator(target, key, paramIndex);
          };
        }
        function __esDecorate(
          ctor,
          descriptorIn,
          decorators,
          contextIn,
          initializers,
          extraInitializers
        ) {
          function accept(f) {
            if (f !== void 0 && typeof f != "function")
              throw new TypeError("Function expected");
            return f;
          }
          for (
            var kind = contextIn.kind,
              key =
                kind === "getter" ? "get" : kind === "setter" ? "set" : "value",
              target =
                !descriptorIn && ctor
                  ? contextIn.static
                    ? ctor
                    : ctor.prototype
                  : null,
              descriptor =
                descriptorIn ||
                (target
                  ? Object.getOwnPropertyDescriptor(target, contextIn.name)
                  : {}),
              _,
              done = !1,
              i = decorators.length - 1;
            i >= 0;
            i--
          ) {
            var context = {};
            for (var p in contextIn)
              context[p] = p === "access" ? {} : contextIn[p];
            for (var p in contextIn.access)
              context.access[p] = contextIn.access[p];
            context.addInitializer = function (f) {
              if (done)
                throw new TypeError(
                  "Cannot add initializers after decoration has completed"
                );
              extraInitializers.push(accept(f || null));
            };
            var result = (0, decorators[i])(
              kind === "accessor"
                ? { get: descriptor.get, set: descriptor.set }
                : descriptor[key],
              context
            );
            if (kind === "accessor") {
              if (result === void 0) continue;
              if (result === null || typeof result != "object")
                throw new TypeError("Object expected");
              (_ = accept(result.get)) && (descriptor.get = _),
                (_ = accept(result.set)) && (descriptor.set = _),
                (_ = accept(result.init)) && initializers.unshift(_);
            } else
              (_ = accept(result)) &&
                (kind === "field"
                  ? initializers.unshift(_)
                  : (descriptor[key] = _));
          }
          target && Object.defineProperty(target, contextIn.name, descriptor),
            (done = !0);
        }
        function __runInitializers(thisArg, initializers, value) {
          for (
            var useValue = arguments.length > 2, i = 0;
            i < initializers.length;
            i++
          )
            value = useValue
              ? initializers[i].call(thisArg, value)
              : initializers[i].call(thisArg);
          return useValue ? value : void 0;
        }
        function __propKey(x) {
          return typeof x == "symbol" ? x : "".concat(x);
        }
        function __setFunctionName(f, name, prefix) {
          return (
            typeof name == "symbol" &&
              (name = name.description
                ? "[".concat(name.description, "]")
                : ""),
            Object.defineProperty(f, "name", {
              configurable: !0,
              value: prefix ? "".concat(prefix, " ", name) : name,
            })
          );
        }
        function __metadata(metadataKey, metadataValue) {
          if (
            typeof Reflect == "object" &&
            typeof Reflect.metadata == "function"
          )
            return Reflect.metadata(metadataKey, metadataValue);
        }
        function __awaiter(thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P
              ? value
              : new P(function (resolve) {
                  resolve(value);
                });
          }
          return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject(e);
              }
            }
            function rejected(value) {
              try {
                step(generator.throw(value));
              } catch (e) {
                reject(e);
              }
            }
            function step(result) {
              result.done
                ? resolve(result.value)
                : adopt(result.value).then(fulfilled, rejected);
            }
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next()
            );
          });
        }
        function __generator(thisArg, body) {
          var _ = {
              label: 0,
              sent: function () {
                if (t[0] & 1) throw t[1];
                return t[1];
              },
              trys: [],
              ops: [],
            },
            f,
            y,
            t,
            g;
          return (
            (g = { next: verb(0), throw: verb(1), return: verb(2) }),
            typeof Symbol == "function" &&
              (g[Symbol.iterator] = function () {
                return this;
              }),
            g
          );
          function verb(n) {
            return function (v) {
              return step([n, v]);
            };
          }
          function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            for (; g && ((g = 0), op[0] && (_ = 0)), _; )
              try {
                if (
                  ((f = 1),
                  y &&
                    (t =
                      op[0] & 2
                        ? y.return
                        : op[0]
                        ? y.throw || ((t = y.return) && t.call(y), 0)
                        : y.next) &&
                    !(t = t.call(y, op[1])).done)
                )
                  return t;
                switch (((y = 0), t && (op = [op[0] & 2, t.value]), op[0])) {
                  case 0:
                  case 1:
                    t = op;
                    break;
                  case 4:
                    return _.label++, { value: op[1], done: !1 };
                  case 5:
                    _.label++, (y = op[1]), (op = [0]);
                    continue;
                  case 7:
                    (op = _.ops.pop()), _.trys.pop();
                    continue;
                  default:
                    if (
                      ((t = _.trys),
                      !(t = t.length > 0 && t[t.length - 1]) &&
                        (op[0] === 6 || op[0] === 2))
                    ) {
                      _ = 0;
                      continue;
                    }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                      _.label = op[1];
                      break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                      (_.label = t[1]), (t = op);
                      break;
                    }
                    if (t && _.label < t[2]) {
                      (_.label = t[2]), _.ops.push(op);
                      break;
                    }
                    t[2] && _.ops.pop(), _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
              } catch (e) {
                (op = [6, e]), (y = 0);
              } finally {
                f = t = 0;
              }
            if (op[0] & 5) throw op[1];
            return { value: op[0] ? op[1] : void 0, done: !0 };
          }
        }
        var __createBinding = Object.create
          ? function (o, m, k, k2) {
              k2 === void 0 && (k2 = k);
              var desc = Object.getOwnPropertyDescriptor(m, k);
              (!desc ||
                ("get" in desc
                  ? !m.__esModule
                  : desc.writable || desc.configurable)) &&
                (desc = {
                  enumerable: !0,
                  get: function () {
                    return m[k];
                  },
                }),
                Object.defineProperty(o, k2, desc);
            }
          : function (o, m, k, k2) {
              k2 === void 0 && (k2 = k), (o[k2] = m[k]);
            };
        function __exportStar(m, o) {
          for (var p in m)
            p !== "default" &&
              !Object.prototype.hasOwnProperty.call(o, p) &&
              __createBinding(o, m, p);
        }
        function __values(o) {
          var s = typeof Symbol == "function" && Symbol.iterator,
            m = s && o[s],
            i = 0;
          if (m) return m.call(o);
          if (o && typeof o.length == "number")
            return {
              next: function () {
                return (
                  o && i >= o.length && (o = void 0),
                  { value: o && o[i++], done: !o }
                );
              },
            };
          throw new TypeError(
            s ? "Object is not iterable." : "Symbol.iterator is not defined."
          );
        }
        function __read(o, n) {
          var m = typeof Symbol == "function" && o[Symbol.iterator];
          if (!m) return o;
          var i = m.call(o),
            r,
            ar = [],
            e;
          try {
            for (; (n === void 0 || n-- > 0) && !(r = i.next()).done; )
              ar.push(r.value);
          } catch (error) {
            e = { error };
          } finally {
            try {
              r && !r.done && (m = i.return) && m.call(i);
            } finally {
              if (e) throw e.error;
            }
          }
          return ar;
        }
        function __spread() {
          for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
          return ar;
        }
        function __spreadArrays() {
          for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
          for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
          return r;
        }
        function __spreadArray(to, from, pack) {
          if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++)
              (ar || !(i in from)) &&
                (ar || (ar = Array.prototype.slice.call(from, 0, i)),
                (ar[i] = from[i]));
          return to.concat(ar || Array.prototype.slice.call(from));
        }
        function __await(v) {
          return this instanceof __await
            ? ((this.v = v), this)
            : new __await(v);
        }
        function __asyncGenerator(thisArg, _arguments, generator) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var g = generator.apply(thisArg, _arguments || []),
            i,
            q = [];
          return (
            (i = {}),
            verb("next"),
            verb("throw"),
            verb("return"),
            (i[Symbol.asyncIterator] = function () {
              return this;
            }),
            i
          );
          function verb(n) {
            g[n] &&
              (i[n] = function (v) {
                return new Promise(function (a, b) {
                  q.push([n, v, a, b]) > 1 || resume(n, v);
                });
              });
          }
          function resume(n, v) {
            try {
              step(g[n](v));
            } catch (e) {
              settle(q[0][3], e);
            }
          }
          function step(r) {
            r.value instanceof __await
              ? Promise.resolve(r.value.v).then(fulfill, reject)
              : settle(q[0][2], r);
          }
          function fulfill(value) {
            resume("next", value);
          }
          function reject(value) {
            resume("throw", value);
          }
          function settle(f, v) {
            f(v), q.shift(), q.length && resume(q[0][0], q[0][1]);
          }
        }
        function __asyncDelegator(o) {
          var i, p;
          return (
            (i = {}),
            verb("next"),
            verb("throw", function (e) {
              throw e;
            }),
            verb("return"),
            (i[Symbol.iterator] = function () {
              return this;
            }),
            i
          );
          function verb(n, f) {
            i[n] = o[n]
              ? function (v) {
                  return (p = !p)
                    ? { value: __await(o[n](v)), done: !1 }
                    : f
                    ? f(v)
                    : v;
                }
              : f;
          }
        }
        function __asyncValues(o) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var m = o[Symbol.asyncIterator],
            i;
          return m
            ? m.call(o)
            : ((o =
                typeof __values == "function"
                  ? __values(o)
                  : o[Symbol.iterator]()),
              (i = {}),
              verb("next"),
              verb("throw"),
              verb("return"),
              (i[Symbol.asyncIterator] = function () {
                return this;
              }),
              i);
          function verb(n) {
            i[n] =
              o[n] &&
              function (v) {
                return new Promise(function (resolve, reject) {
                  (v = o[n](v)), settle(resolve, reject, v.done, v.value);
                });
              };
          }
          function settle(resolve, reject, d, v) {
            Promise.resolve(v).then(function (v2) {
              resolve({ value: v2, done: d });
            }, reject);
          }
        }
        function __makeTemplateObject(cooked, raw) {
          return (
            Object.defineProperty
              ? Object.defineProperty(cooked, "raw", { value: raw })
              : (cooked.raw = raw),
            cooked
          );
        }
        var __setModuleDefault = Object.create
          ? function (o, v) {
              Object.defineProperty(o, "default", { enumerable: !0, value: v });
            }
          : function (o, v) {
              o.default = v;
            };
        function __importStar(mod) {
          if (mod && mod.__esModule) return mod;
          var result = {};
          if (mod != null)
            for (var k in mod)
              k !== "default" &&
                Object.prototype.hasOwnProperty.call(mod, k) &&
                __createBinding(result, mod, k);
          return __setModuleDefault(result, mod), result;
        }
        function __importDefault(mod) {
          return mod && mod.__esModule ? mod : { default: mod };
        }
        function __classPrivateFieldGet(receiver, state, kind, f) {
          if (kind === "a" && !f)
            throw new TypeError(
              "Private accessor was defined without a getter"
            );
          if (
            typeof state == "function"
              ? receiver !== state || !f
              : !state.has(receiver)
          )
            throw new TypeError(
              "Cannot read private member from an object whose class did not declare it"
            );
          return kind === "m"
            ? f
            : kind === "a"
            ? f.call(receiver)
            : f
            ? f.value
            : state.get(receiver);
        }
        function __classPrivateFieldSet(receiver, state, value, kind, f) {
          if (kind === "m")
            throw new TypeError("Private method is not writable");
          if (kind === "a" && !f)
            throw new TypeError(
              "Private accessor was defined without a setter"
            );
          if (
            typeof state == "function"
              ? receiver !== state || !f
              : !state.has(receiver)
          )
            throw new TypeError(
              "Cannot write private member to an object whose class did not declare it"
            );
          return (
            kind === "a"
              ? f.call(receiver, value)
              : f
              ? (f.value = value)
              : state.set(receiver, value),
            value
          );
        }
        function __classPrivateFieldIn(state, receiver) {
          if (
            receiver === null ||
            (typeof receiver != "object" && typeof receiver != "function")
          )
            throw new TypeError("Cannot use 'in' operator on non-object");
          return typeof state == "function"
            ? receiver === state
            : state.has(receiver);
        }
        function __addDisposableResource(env, value, async) {
          if (value != null) {
            if (typeof value != "object" && typeof value != "function")
              throw new TypeError("Object expected.");
            var dispose;
            if (async) {
              if (!Symbol.asyncDispose)
                throw new TypeError("Symbol.asyncDispose is not defined.");
              dispose = value[Symbol.asyncDispose];
            }
            if (dispose === void 0) {
              if (!Symbol.dispose)
                throw new TypeError("Symbol.dispose is not defined.");
              dispose = value[Symbol.dispose];
            }
            if (typeof dispose != "function")
              throw new TypeError("Object not disposable.");
            env.stack.push({ value, dispose, async });
          } else async && env.stack.push({ async: !0 });
          return value;
        }
        var _SuppressedError =
          typeof SuppressedError == "function"
            ? SuppressedError
            : function (error, suppressed, message) {
                var e = new Error(message);
                return (
                  (e.name = "SuppressedError"),
                  (e.error = error),
                  (e.suppressed = suppressed),
                  e
                );
              };
        function __disposeResources(env) {
          function fail(e) {
            (env.error = env.hasError
              ? new _SuppressedError(
                  e,
                  env.error,
                  "An error was suppressed during disposal."
                )
              : e),
              (env.hasError = !0);
          }
          function next() {
            for (; env.stack.length; ) {
              var rec = env.stack.pop();
              try {
                var result = rec.dispose && rec.dispose.call(rec.value);
                if (rec.async)
                  return Promise.resolve(result).then(next, function (e) {
                    return fail(e), next();
                  });
              } catch (e) {
                fail(e);
              }
            }
            if (env.hasError) throw env.error;
          }
          return next();
        }
        __webpack_exports__2.default = {
          __extends,
          __assign,
          __rest,
          __decorate,
          __param,
          __metadata,
          __awaiter,
          __generator,
          __createBinding,
          __exportStar,
          __values,
          __read,
          __spread,
          __spreadArrays,
          __spreadArray,
          __await,
          __asyncGenerator,
          __asyncDelegator,
          __asyncValues,
          __makeTemplateObject,
          __importStar,
          __importDefault,
          __classPrivateFieldGet,
          __classPrivateFieldSet,
          __classPrivateFieldIn,
          __addDisposableResource,
          __disposeResources,
        };
      },
    },
    __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== void 0) return cachedModule.exports;
    var module = (__webpack_module_cache__[moduleId] = { exports: {} });
    return (
      __webpack_modules__[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      ),
      module.exports
    );
  }
  (function () {
    __webpack_require__.d = function (exports, definition) {
      for (var key in definition)
        __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key) &&
          Object.defineProperty(exports, key, {
            enumerable: !0,
            get: definition[key],
          });
    };
  })(),
    (function () {
      __webpack_require__.o = function (obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      };
    })(),
    (function () {
      __webpack_require__.r = function (exports) {
        typeof Symbol < "u" &&
          Symbol.toStringTag &&
          Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module",
          }),
          Object.defineProperty(exports, "__esModule", { value: !0 });
      };
    })();
  var __webpack_exports__ = {};
  (function () {
    "use strict";
    var exports = __webpack_exports__,
      __webpack_unused_export__;
    (__webpack_unused_export__ = { value: !0 }),
      __webpack_require__(5065),
      __webpack_require__(7090),
      __webpack_require__(1770);
    const define_components_1 = __webpack_require__(3626);
    __webpack_require__(29),
      Shopify.designMode &&
        (document.documentElement.className = `${document.documentElement.className} is-editor-mode`),
      (0, define_components_1.defineComponents)();
  })();
})();
//# sourceMappingURL=/cdn/shop/t/32/assets/bundle.js.map?v=113605238944458979261742302648
