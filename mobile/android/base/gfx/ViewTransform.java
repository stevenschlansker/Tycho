/* -*- Mode: Java; c-basic-offset: 4; tab-width: 20; indent-tabs-mode: nil; -*-
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mozilla.goanna.gfx;

import org.mozilla.goanna.mozglue.generatorannotations.WrapEntireClassForJNI;

@WrapEntireClassForJNI
public class ViewTransform {
    public float x;
    public float y;
    public float scale;
    public float fixedLayerMarginLeft;
    public float fixedLayerMarginTop;
    public float fixedLayerMarginRight;
    public float fixedLayerMarginBottom;
    public float offsetX;
    public float offsetY;

    public ViewTransform(float inX, float inY, float inScale) {
        x = inX;
        y = inY;
        scale = inScale;
    }
}

