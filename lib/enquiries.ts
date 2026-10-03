import { z } from "zod";
export const enquiryServices=["Website","Web application","Android app","Website & app","Not sure yet"] as const;
export const enquirySchema=z.object({name:z.string().trim().min(2,"Tell us your name.").max(100),email:z.string().trim().email("Enter a valid email address.").max(254),organization:z.string().trim().max(120),service:z.enum(enquiryServices),budget:z.string().trim().max(100),timeline:z.string().trim().max(100),message:z.string().trim().min(20,"Tell us a little more about your project.").max(3500),website:z.string().max(200),startedAt:z.number().int().positive()});
export const PROJECT_ENQUIRY_PREFIX="PROJECT ENQUIRY\n";
