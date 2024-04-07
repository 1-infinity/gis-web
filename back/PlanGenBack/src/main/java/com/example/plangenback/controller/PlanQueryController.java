package com.example.plangenback.controller;

import com.example.plangenback.model.ResponseResult;
import com.example.plangenback.service.PlanQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class PlanQueryController {
    @Autowired
    public PlanQueryService planQueryService;

    @GetMapping("/planQuery/getAllTitle")
    public ResponseResult getAllTitleByCityAndDisaster(@RequestParam String city, String disaster) {
        return planQueryService.getAllTitleByCityAndDisaster(city, disaster);
    }

    @GetMapping("/planQuery/getTextByTitle")
    public ResponseResult getTextByTitle(@RequestParam Integer documentId, String title) {
        return planQueryService.getTextByTitle(documentId, title);
    }

}
