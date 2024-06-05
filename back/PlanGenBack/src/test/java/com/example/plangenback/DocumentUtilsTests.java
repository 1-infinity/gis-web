package com.example.plangenback;

import com.example.plangenback.service.FileProcessingService;
import com.example.plangenback.utils.DocumentUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class DocumentUtilsTests {

    @Test
    public void readDocumentUtilTest() {
        System.out.println(DocumentUtils.readDocumentByPath(".\\planFiles\\flood_plan_undefined2.docx"));
    }

    @Autowired
    private FileProcessingService fileProcessingService;
    @Test
    public void addDocumentTest() {
        String mainTitle = "洪涝灾害预案";
        String city = "南京市";
        String disaster = "洪水";
        String filePath = ".\\planFiles\\flood_plan_undefined2.docx";
        System.out.println(fileProcessingService.addFile(mainTitle, city, disaster, DocumentUtils.readDocumentByPath(filePath)));
    }
}
