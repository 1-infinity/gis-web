package com.example.plangenback;

import com.example.plangenback.utils.FileUtils;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class FileUtilsTests {

    @Test
    public void readDocumentUtilTest() {
        System.out.println(FileUtils.readDocument(".\\planFiles\\flood_plan_undefined2.docx"));
    }
}
