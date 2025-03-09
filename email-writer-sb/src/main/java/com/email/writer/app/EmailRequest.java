package com.email.writer.app;

import lombok.Data;

@Data//It automatically generates getter setter mthds
public class EmailRequest {
    private String emailContent;
    private String tone;
}
