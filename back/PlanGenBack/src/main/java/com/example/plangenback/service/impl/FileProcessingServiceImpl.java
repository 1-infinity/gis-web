package com.example.plangenback.service.impl;

import com.example.plangenback.entity.*;
import com.example.plangenback.mapper.DocumentMapper;
import com.example.plangenback.mapper.TextMapper;
import com.example.plangenback.mapper.TitleMapper;
import com.example.plangenback.model.PlanContentType;
import com.example.plangenback.service.FileProcessingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;

@Service
public class FileProcessingServiceImpl implements FileProcessingService {

    @Autowired
    private DocumentMapper documentMapper;

    @Autowired
    private TitleMapper titleMapper;

    @Autowired
    private TextMapper textMapper;

    public boolean addFile(String mainTitle, String city, String disaster, List<PlanContentType> contents) {
        try {
            System.out.println(contents);
            //创建一个新的document
            Document document = new Document(mainTitle, city, disaster, LocalDateTime.now());
            documentMapper.insert(document);
            Integer documentId = document.getId();

            //插入文档内容
            Stack<Title> stk = new Stack<>();
            stk.push(new Title(0,-1, 0, "-1", "flag"));
            StringBuilder sb = new StringBuilder();
            for (PlanContentType content : contents) {
                //是正文
                if (content.getType() == null) {
                    //可能有连续的几段正文，组合到一起
                    if (sb.length() > 0) {
                        sb.append("\n");
                    }
                    sb.append(content.getContent());
                }
                //是标题
                else {
                    //先将之前的正文插入
                    if (sb.length() > 0) {
                        Text text = new Text(documentId, stk.peek().getId(), sb.toString());
                        textMapper.insert(text);
                        sb.delete(0, sb.length());
                    }

                    //再处理新的标题
                    while (!stk.isEmpty() && stk.peek().getSecNum().compareTo(content.getType()) >= 0) {
                        stk.pop();
                    }

                    Title title = new Title(documentId, stk.peek().getId(), content.getType(), content.getContent());
                    titleMapper.insert(title);
                    stk.push(title);
                }
            }

            return true;
        }
        catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
