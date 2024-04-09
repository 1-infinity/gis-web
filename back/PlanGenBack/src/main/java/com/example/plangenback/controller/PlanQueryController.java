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

    @GetMapping("/planQuery/getAllTitle")
    public ResponseResult getAllTitleByCityAndDisaster(@RequestParam String city, String disaster) {
        return planQueryService.getAllTitleByCityAndDisaster(city, disaster);
    }


    @PostMapping("/planQuery/getTextByTitle")
    public ResponseResult getTextByTitle(@RequestBody GetTextByTitleRequestType type) {
        return planQueryService.getTextByTitle(type.documentId, type.title);
    }

}
