package com.example.plangenback.service.impl;

import com.example.plangenback.entity.Document;
import com.example.plangenback.mapper.DocumentMapper;
import com.example.plangenback.mapper.TextMapper;
import com.example.plangenback.mapper.TitleMapper;
import com.example.plangenback.model.PlanContentType;
import com.example.plangenback.service.FileProcessingService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class FileProcessingServiceImpl implements FileProcessingService {

    @Autowired
    private DocumentMapper documentMapper;

    @Autowired
    private TitleMapper titleMapper;

    @Autowired
    private TextMapper textMapper;

    public void addFile(String mainTitle, String city, String disaster, List<PlanContentType> contents) {
        //创建一个新的document
        Document document = new Document(mainTitle, city, disaster);
        documentMapper.insert(document);
        Integer documentId = document.getId();

        //插入文档内容

    }
}
