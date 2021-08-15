package com.qcmmanager.service.pdf;

import java.awt.geom.Point2D;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.apache.pdfbox.contentstream.PDFGraphicsStreamEngine;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.graphics.image.PDImage;

public class PdfCheckBoxFinder extends PDFGraphicsStreamEngine {

    public PdfCheckBoxFinder(PDPage page) {
        super(page);
        try {
            processPage(page);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //
    // PDFGraphicsStreamEngine overrides
    //
    @Override
    public void appendRectangle(Point2D p0, Point2D p1, Point2D p2, Point2D p3) throws IOException {
        moveTo((float) p0.getX(), (float) p0.getY());
        path.add(new Rectangle(p0, p1, p2, p3));
    }

    @Override
    public void moveTo(float x, float y) {
        currentPoint = new Point2D.Float(x, y);
        currentStartPoint = currentPoint;
    }

    @Override
    public void lineTo(float x, float y) {
        Point2D point = new Point2D.Float(x, y);
        currentPoint = point;
    }

    @Override
    public void curveTo(float x1, float y1, float x2, float y2, float x3, float y3) {
        Point2D point3 = new Point2D.Float(x3, y3);
        currentPoint = point3;
    }

    @Override
    public Point2D getCurrentPoint() {
        return currentPoint;
    }

    @Override
    public void closePath() {
        currentPoint = currentStartPoint;
    }

    @Override
    public void endPath() {
        clearPath();
    }

    @Override
    public void strokePath() {
        clearPath();
    }

    @Override
    public void fillPath(int windingRule) {
        processPath();
    }

    @Override
    public void fillAndStrokePath(int windingRule) {
        clearPath();
    }

    @Override
    public void drawImage(PDImage pdImage) {}

    @Override
    public void clip(int windingRule) {}

    @Override
    public void shadingFill(COSName shadingName) {}

    //
    // internal representation of a path
    //
    interface PathElement {}

    static class Rectangle implements PathElement {

        final Point2D p0, p1, p2, p3;
        private static final float CORRECT_SIZE = 8.148f;

        Rectangle(Point2D p0, Point2D p1, Point2D p2, Point2D p3) {
            this.p0 = p0;
            this.p1 = p1;
            this.p2 = p2;
            this.p3 = p3;
        }

        public boolean hasCorrectSize() {
            return width() - CORRECT_SIZE < 0.001;
        }

        public float X() {
            return (float) p0.getX();
        }

        public float Y() {
            return (float) p0.getY();
        }

        public float width() {
            return (float) p1.getX() - (float) p0.getX();
        }
    }

    Point2D currentPoint = null;
    Point2D currentStartPoint = null;

    void clearPath() {
        path.clear();
        currentPoint = null;
        currentStartPoint = null;
    }

    void processPath() {
        if (path.size() == 1 && path.get(0) instanceof Rectangle) {
            Rectangle rectangle = (Rectangle) path.get(0);
            if (rectangle.hasCorrectSize()) {
                rectangles.add(rectangle);
            }
        }
        clearPath();
    }

    //
    // members
    //
    final List<PathElement> path = new ArrayList<>();

    final List<Rectangle> rectangles = new ArrayList<>();

    public List<Rectangle> getRectangles() {
        return rectangles;
    }
}
