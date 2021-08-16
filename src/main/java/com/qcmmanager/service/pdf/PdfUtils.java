package com.qcmmanager.service.pdf;

import com.itextpdf.forms.PdfAcroForm;
import com.itextpdf.forms.fields.PdfButtonFormField;
import com.itextpdf.forms.fields.PdfFormField;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.utils.PageRange;
import com.itextpdf.kernel.utils.PdfSplitter;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.stereotype.Service;

@Service
public class PdfUtils {

    public List<byte[]> getSplitEditableQcms(byte[] qcms) {
        List<byte[]> splitQcms = new ArrayList<>();
        List<ByteArrayOutputStream> outputs = new ArrayList<>();
        try {
            PDDocument originalAllPages = Loader.loadPDF(qcms);
            PdfDocument oriAllPages = new PdfDocument(new PdfReader(new ByteArrayInputStream(qcms)));
            PdfSplitter pdfSplitter = new PdfSplitter(oriAllPages) {
                @Override
                protected PdfWriter getNextPdfWriter(PageRange documentPageRange) {
                    ByteArrayOutputStream output = new ByteArrayOutputStream(500000);
                    outputs.add(output);
                    return new PdfWriter(output);
                }
            };

            List<PdfDocument> pdfDocuments = pdfSplitter.splitByPageCount(1);

            for (int pageIndex = 0; pageIndex < originalAllPages.getNumberOfPages(); pageIndex++) {
                PdfDocument oneQCM = pdfDocuments.get(pageIndex);
                addEditableForm(oneQCM, originalAllPages, pageIndex);
                oneQCM.close();
                splitQcms.add(outputs.get(pageIndex).toByteArray());
            }

            originalAllPages.close();
            oriAllPages.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return splitQcms;
    }

    private void addEditableForm(PdfDocument oneQCM, PDDocument originalAllPages, int pageIndex) {
        PdfAcroForm form = PdfAcroForm.getAcroForm(oneQCM, true);
        PdfCheckBoxFinder finder = new PdfCheckBoxFinder(originalAllPages.getPage(pageIndex));
        int i = 0;
        for (PdfCheckBoxFinder.Rectangle rectangle : finder.getRectangles()) {
            addCheckBox(oneQCM, form, i, rectangle);
            i++;
        }
    }

    private void addCheckBox(PdfDocument oneQCM, PdfAcroForm form, int i, PdfCheckBoxFinder.Rectangle rectangle) {
        PdfButtonFormField checkField = PdfFormField.createCheckBox(
            oneQCM,
            new Rectangle(rectangle.X(), rectangle.Y(), rectangle.width(), rectangle.width()),
            "name" + i,
            "Off",
            PdfFormField.TYPE_SQUARE
        );
        checkField.setBackgroundColor(DeviceRgb.WHITE);
        checkField.setFontSize(50);
        form.addField(checkField);
    }

    public byte[] getPdfWithUpdatedCheckboxes(byte[] oneQcmByte, List<Checkbox> checkboxes) {
        try {
            ByteArrayOutputStream output = new ByteArrayOutputStream(500000);
            PdfDocument oneQCM = new PdfDocument(new PdfReader(new ByteArrayInputStream(oneQcmByte)), new PdfWriter(output));

            PdfAcroForm form = PdfAcroForm.getAcroForm(oneQCM, false);
            setCheckboxesValue(checkboxes, form);

            oneQCM.close();
            return output.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private void setCheckboxesValue(List<Checkbox> checkboxes, PdfAcroForm form) {
        checkboxes.forEach(
            checkbox -> {
                PdfFormField field = form.getField(checkbox.getName());
                if (checkbox.isValue()) {
                    field.setValue("Yes");
                } else {
                    field.setValue("Off");
                }
            }
        );
    }
}
