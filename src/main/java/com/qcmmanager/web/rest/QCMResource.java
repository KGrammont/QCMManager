package com.qcmmanager.web.rest;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class QCMResource {

    private final Logger log = LoggerFactory.getLogger(QCMResource.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ResourceLoader resourceLoader;

    public QCMResource(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @GetMapping("/qcm/testpdf")
    public ResponseEntity<Resource> getDocumentAsFile() throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");
        Resource pdfResource = resourceLoader.getResource("classpath:DOC-sujet.pdf");
        File pdfFile = pdfResource.getFile();
        InputStreamResource streamResource = new InputStreamResource(new FileInputStream(pdfFile));

        return ResponseEntity
            .ok()
            .headers(headers)
            .contentLength(pdfFile.length())
            .contentType(MediaType.APPLICATION_JSON)
            .body(streamResource);
    }
}
