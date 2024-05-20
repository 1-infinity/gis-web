package com.example.plangenback.utils;

import com.example.plangenback.model.PlanContentType;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FileUtils {
    public static List<PlanContentType> readDocument(String filePath) {
        try (FileInputStream fis = new FileInputStream(filePath)) {
            // 打开已有的Word文档
            XWPFDocument document = new XWPFDocument(fis);


            // 获取文档中的所有段落
            List<XWPFParagraph> paragraphs = document.getParagraphs();

            List<PlanContentType> res = new ArrayList<>();
            // 检查段落列表是否为空
            if (paragraphs.isEmpty()) {
                System.out.println("文档中没有找到任何段落。");
                return null;
            } else {
                for (XWPFParagraph paragraph : paragraphs) {
                    PlanContentType contentType = new PlanContentType(paragraph.getStyle(), paragraph.getText());
                    res.add(contentType);
                }
            }

            return res;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
