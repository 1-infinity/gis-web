package com.example.plangenback.controller;

import com.example.plangenback.model.ResponseResult;
import com.example.plangenback.service.FileProcessingService;
import com.example.plangenback.utils.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class FileProcessingController {
    @Autowired
    private FileProcessingService fileProcessingService;

    @PostMapping("/document/addDocument")
    public ResponseResult addDocument(@RequestParam String mainTitle, String city, String disaster, String filePath) {
        if (fileProcessingService.addFile(mainTitle, city, disaster, FileUtils.readDocument(filePath))) {
            return new ResponseResult<>(200, "success", null);
        }
        else {
            return new ResponseResult<>(500, "Add Document Failed", null);
        }
    }
}
