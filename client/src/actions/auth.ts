"use server"

import { protectLoginRules, protectSignUpRules } from '@/arcjet'
import {request} from '@arcjet/next'

export const protectSignUpAction = async (email:string) => {
    const req = await request()
    const decision = await protectSignUpRules.protect(req,{
        email
    })
    console.log("Decision",decision)

    if(decision.isDenied()){
        if(decision.reason.isEmail()){   //1
            const emailReasonType = decision.reason.emailTypes
            if(emailReasonType.includes("DISPOSABLE")){
                return{
                    error:"Disposable email addresses are not allowed.",
                    success:false,
                    status:403
                }
            } else if(emailReasonType.includes("INVALID")){
                return{
                    error:"Invalid email address.",
                    success:false,
                    status:403
                }
            } else if(emailReasonType.includes("NO_MX_RECORDS")){
                return{
                    error:"Email domain has no MX records.",
                    success:false,
                    status:403
                }
            }
        } else if(decision.reason.isBot()){   //2
            return{
                error:"Bot-like behavior detected. Submission blocked.",
                success:false,
                status:403
            }
        } else if(decision.reason.isRateLimit()){  //3
            return{
                error:"Too many requests. Please try again later.",
                success:false,
                status:429
            }
        }
    }

    return {
        success:true,
        status:200
    }

}


export const protectLoginAction = async (email:string) => {
    const req = await request()
    const decision = await protectLoginRules.protect(req,{
        email
    })
    console.log("Decision",decision)

    if(decision.isDenied()){
        if(decision.reason.isEmail()){   //1
            const emailReasonType = decision.reason.emailTypes
            if(emailReasonType.includes("DISPOSABLE")){
                return{
                    error:"Disposable email addresses are not allowed.",
                    success:false,
                    status:403
                }
            } else if(emailReasonType.includes("INVALID")){
                return{
                    error:"Invalid email address.",
                    success:false,
                    status:403
                }
            } else if(emailReasonType.includes("NO_MX_RECORDS")){
                return{
                    error:"Email domain has no MX records.",
                    success:false,
                    status:403
                }
            }
        } else if(decision.reason.isRateLimit()){  //3
            return{
                error:"Too many requests. Please try again later.",
                success:false,
                status:429
            }
        }
    }

    return {
        success:true,
        status:200
    }
}