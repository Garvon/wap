<template>
    <div class="box">
        <div class="boxc">
            <div class="logo">
                <div class="photo">
                    <Icon type="ios-person" :size="80" slot="prepend"></Icon>
                </div>
            </div>
            <div class="boxF">
                <Form ref="formInline" :model="formInline" :rules="ruleInline"  style="opacity:1;margin:0 auto;">
                    <FormItem prop="username">
                        <Input type="text" v-model="formInline.username" placeholder="请输入用户名">
                            <Icon type="ios-person" :size="18" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="oldPassWord">
                        <Input type="password" v-model="formInline.oldPassWord" placeholder="原始密码">
                            <Icon type="md-lock" :size="18" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="passWord">
                        <Input type="password" v-model="formInline.passWord" placeholder="新密码">
                            <Icon type="md-lock" :size="18" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="confirmPassWord">
                        <Input type="password" v-model="formInline.confirmPassWord" placeholder="确认密码">
                            <Icon type="md-lock" :size="18" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" size="large" @click="doLogin" long>确定</Button>
                    </FormItem>
                </Form>
                <div class="prompt">{{prompt}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        confirmlogin
    } from '@/api/login'
    import { Card, Form, FormItem, Input, Icon, Button } from 'iview'
    export default {
        components: {
            Card,
            Form,
            FormItem,
            Input,
            Icon, 
            Button
        },
        data() {
            return {
                prompt: '',
                formInline: {
                    username: '',
                    oldPassWord:'',
                    passWord: '',
                    confirmPassWord:''
                },
                ruleInline: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    oldPassWord: [
                        { required: true, message: '密码不能为空.', trigger: 'blur' },
                    ],
                    passWord: [
                        { required: true, message: '密码不能为空.', trigger: 'blur' },
                    ],
                    confirmPassWord: [
                        { required: true, message: '密码不能为空.', trigger: 'blur' },
                    ]
                }
            }
        },
        mounted() {
            this.formInline.username = sessionStorage.getItem('username')
        },
        methods: {
            async doLogin() {
                let {
                    username,
                    oldPassWord,
                    passWord,
                    confirmPassWord
                } = this.formInline;
                if (passWord == '' || oldPassWord == '' || confirmPassWord == '') {
                    this.prompt = '密码不能为空'
                } else {
                    let res
                    // 登录
                    res = await confirmlogin({
                        userName: username,
                        oldPassWord: oldPassWord,
                        passWord: passWord,
                        confirmPassWord: confirmPassWord
                    });
                    if (res.data.result && res.data.result != null) {
                        this.prompt = res.data.result[0][300];
                        setTimeout(() => {
                            this.$router.push({
                                path: "/index"
                            });
                        }, 1000);
                    } else {
                        let message = res.data.message.message;
                        this.prompt = message;
                    }
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .box {
        width: 100%;
        height: 100%;
        position: relative;
        font-size: 16px;

        .boxc {
            width:80%;
            position: absolute;
            left: 50%;
            top: 50%;
            width: 70%;
            margin-left: -35%;
            margin-top: -204px;
            // transform: translateY(50%);
            // -webkit-transform: translateY(50%);
            z-index: 2;
            background:#fff;
            background: rgba(255, 255, 255, .65);
            border-radius: 5px;
            .boxF{
                width:80%;
                margin:0 auto;
                padding:10px 0;
                // background: #ccc;
            }
            .logo {
                width: 100%;
                text-align: center;
            }
        
            .prompt {
                height: 20px;
                width: 100%;
                text-align: center;
                line-height: 20px;
                margin-top: 10px;
                color: #ff0000;
                font-size: 14px;
            }
        }
        .photo {
            margin-top: 10px;
            display: inline-block;
            background-color: #3994B0;
            width: 80px;
            height: 80px;
            color: white;
            border-radius: 10px;
        }
    }
</style>
<style lang="scss">
    @import "@/styles/theme.scss";

    .box {
        .weui-cell {
            padding: 10px .25rem 5px .25rem;
            // border-bottom: 1px solid #D9D9D9;

        }

        .weui-input {
            color: white;
        }

        .weui-cell:before {
            border: none; //1px solid #D9D9D9
        }
    }
</style>