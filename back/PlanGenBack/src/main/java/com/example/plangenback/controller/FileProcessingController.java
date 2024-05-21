package com.example.plangenback.controller;

import com.example.plangenback.model.ResponseResult;
import com.example.plangenback.service.FileProcessingService;
import com.example.plangenback.utils.DocumentUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static jdk.nashorn.internal.runtime.regexp.joni.Config.log;

@RestController
@CrossOrigin
public class FileProcessingController {
    @Autowired
    private FileProcessingService fileProcessingService;

    @PostMapping("/document/addDocumentByURL")
    //@CrossOrigin(origins = "http://localhost:8888")
    public ResponseResult addDocument(@RequestParam String mainTitle, String city, String disaster, String filePath) {
        if (fileProcessingService.addFile(mainTitle, city, disaster, DocumentUtils.readDocumentByPath(filePath))) {
            return new ResponseResult<>(200, "success", null);
        }
        else {
            return new ResponseResult<>(500, "Add Document Failed", null);
        }
    }

    @PostMapping("/document/addDocumentByFile")
    public ResponseResult addDocument(@RequestParam String mainTitle,
                                      @RequestParam String city,
                                      @RequestParam String disaster,
                                      @RequestParam("file") MultipartFile file) {
        System.out.println(file);
        if (fileProcessingService.addFile(mainTitle, city, disaster, DocumentUtils.readDocument(file))) {
            return new ResponseResult<>(200, "success", null);
        }
        else {
            return new ResponseResult<>(500, "Add Document Failed", null);
        }
    }
}
