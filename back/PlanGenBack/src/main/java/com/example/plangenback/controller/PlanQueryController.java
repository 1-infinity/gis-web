package com.example.plangenback.controller;

import com.example.plangenback.model.GetTextByTitleRequestType;
import com.example.plangenback.model.ResponseResult;
import com.example.plangenback.service.PlanQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class PlanQueryController {
    @Autowired
    public PlanQueryService planQueryService;

    @GetMapping("/planQuery/getAllDocuments")
    public ResponseResult getAllDocuments(@RequestParam String city, String disaster) {
        return planQueryService.getAllDocuments(city, disaster);
    }

    @GetMapping("/planQuery/getAllTitle")
    public ResponseResult getAllTitleById(@RequestParam Integer id, String mainTitle) {
        return planQueryService.getAllTitleById(id, mainTitle);
    }

    @PostMapping("/planQuery/getTextByTitle")
    public ResponseResult getTextByTitle(@RequestBody GetTextByTitleRequestType type) {
        return planQueryService.getTextByTitle(type.documentId, type.title);
    }

    @DeleteMapping("planQuery/deleteDocumentById")
    public ResponseResult deleteDocumentById(@RequestParam Integer documentId) {
        return planQueryService.deleteDocumentById(documentId);
    }
}