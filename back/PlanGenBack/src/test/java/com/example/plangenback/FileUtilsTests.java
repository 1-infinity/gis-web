package com.example.plangenback;

import com.example.plangenback.service.FileProcessingService;
import com.example.plangenback.utils.FileUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class FileUtilsTests {

    @Test
    public void readDocumentUtilTest() {
        System.out.println(FileUtils.readDocument(".\\planFiles\\flood_plan_undefined2.docx"));
    }

    @Autowired
    private FileProcessingService fileProcessingService;
    @Test
    public void addDocumentTest() {
        String mainTitle = "洪涝灾害预案";
        String city = "南京市";
        String disaster = "洪水";
        String filePath = ".\\planFiles\\flood_plan_undefined2.docx";
        System.out.println(fileProcessingService.addFile(mainTitle, city, disaster, FileUtils.readDocument(filePath)));
    }
}
