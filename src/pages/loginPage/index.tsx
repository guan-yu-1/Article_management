import React, { ChangeEvent, FormEvent } from "react";
import { z, ZodError } from "zod";
import styles from "./index.module.css";
import logo from "@image/logo.png";
import { loginRequest } from "@requests/auth";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { connect, MapDispatchToPropsParam } from "react-redux";
import { UserActions } from "@actions/userActions";
import { AppDispatch } from "@src/store";
import { Credentials } from "auth";
import { UserCreators } from "@store/creators/userCreators";
import { RouteComponentProps } from "react-router-dom";

// 表单验证错误信息
interface FormError {
  mobile?: string[];
  code?: string[];
  agree?: string[];
}
// 表单状态
interface FormState {
  mobile: string;
  code: string;
  agree: boolean;
}

interface StateProps {}

// 用于发送 Action 指令的方法的类型
interface DispatchProps {
  saveCredentials(credentials: Credentials): UserActions.SaveCredentials;
}

interface OwnProps {}

// 组件 Props 对象的类型
type Props = OwnProps & StateProps & DispatchProps & RouteComponentProps;

// 组件状态 State 对象的类型
interface States {
  formState: FormState;
  formError: FormError;
}

// 创建表单验证规则
const formSchema = z.object({
  mobile: z
    .string()
    .min(1, "请输入手机号")
    .regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
  code: z
    .string()
    .min(1, "请输入验证码")
    .regex(/^\d{6}$/, "验证码格式不正确"),
  agree: z.literal(true, {
    errorMap: () => ({ message: "请勾选用户协议和隐私条款" }),
  }),
});

class LoginPage extends React.Component<Props, States> {
  // 构造函数
  constructor(props: Props) {
    super(props);
    // 组件状态
    this.state = {
      // 记录表单状态
      formState: {
        mobile: "13911111111",
        code: "246810",
        agree: true,
      },
      // 记录表单验证错误
      formError: {
        mobile: undefined,
        code: undefined,
        agree: undefined,
      },
    };
    // 使以下方法中的 this 关键字指向当前类的实例
    this.updateFormState = this.updateFormState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFieldValidate = this.onFieldValidate.bind(this);
    this.validateMobile = this.validateMobile.bind(this);
    this.validateCode = this.validateCode.bind(this);
    this.validateAgree = this.validateAgree.bind(this);
  }

  // 更新表单状态
  updateFormState(event: ChangeEvent<HTMLInputElement>) {
    this.setState({
      formState: {
        ...this.state.formState,
        [event.target.name]:
          event.target.name === "agree"
            ? event.target.checked
            : event.target.value,
      },
    });
  }

  // 表单验证
  onFormValidate() {
    // 捕获错误
    try {
      // 验证表单
      formSchema.parse(this.state.formState);
    } catch (error: unknown) {
      // 为错误对象标注类型
      const zodError = error as ZodError<FormError>;
      // 获取错误信息
      const fieldErrors = zodError.formErrors.fieldErrors;
      // 更新组件状态
      this.setState({ formError: { ...fieldErrors } });
      // 继续抛异常
      throw new ZodError(zodError.issues);
    }
  }

  // 表单字段验证
  onFieldValidate<K extends keyof FormError, V extends FormState[K]>(
    name: K,
    value: V
  ) {
    // 捕获错误
    try {
      // 验证名称为 [name] 的表单项
      formSchema.shape[name].parse(value);
      // 验证通过, 设置该表单项的错误信息 undefined
      this.setState({
        formError: { ...this.state.formError, [name]: undefined },
      });
    } catch (error) {
      // 为错误对象标注类型
      const zodError = error as ZodError<FormError>;
      // 未通过验证 获取错误信息
      const formErrors = zodError.formErrors.formErrors;
      // 更新组件状态
      this.setState({
        formError: { ...this.state.formError, [name]: formErrors },
      });
    }
  }

  // 验证手机号
  validateMobile(event: FormEvent<HTMLInputElement>) {
    return this.onFieldValidate("mobile", event.currentTarget.value);
  }

  // 验证手机验证码
  validateCode(event: FormEvent<HTMLInputElement>) {
    return this.onFieldValidate("code", event.currentTarget.value);
  }

  // 验证是否同意协议
  validateAgree(event: FormEvent<HTMLInputElement>) {
    return this.onFieldValidate("agree", event.currentTarget.checked);
  }

  // 渲染错误信息
  errorMessage(name: keyof FormError) {
    // 获取错误信息
    const message = this.state.formError[name];
    // 渲染错误信息
    return message && <p className="help is-danger">{message.join("_")}</p>;
  }

  // 表单提交
  async onSubmit(event: FormEvent<HTMLFormElement>) {
    // 阻止表单提交默认跳转的行为
    event.preventDefault();
    // 捕获表单验证错误
    try {
      // 表单验证
      this.onFormValidate();
    } catch (error) {
      // 表单未验证通过, 阻止程序继续向下执行
      return;
    }
    // 获取表单状态
    const formState = this.state.formState;
    // 捕获登录请求错误
    try {
      // 发送登录请求
      const response = await loginRequest({
        mobile: formState.mobile,
        code: formState.code,
      });
      // 登录成功提示
      toast.success("登录成功");
      // 保存用户身份凭据
      this.props.saveCredentials(response.data);
      // 跳转到首页
      this.props.history.push("/admin/dashboard");
    } catch (error) {
      // 登录失败
      if (error instanceof AxiosError) {
        // 渲染服务端返回的错误信息
        toast.error(error.response?.data.message);
      }
    }
  }

  render() {
    // 获取表单状态
    const { formState } = this.state;
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
          <img className={styles.logo} src={logo} alt="极客园" />
          <form onSubmit={this.onSubmit}>
            <div className="field">
              <input
                className="input"
                type="text"
                placeholder="请输入手机号"
                value={formState.mobile}
                onChange={this.updateFormState}
                onInput={this.validateMobile}
                onBlur={this.validateMobile}
                name="mobile"
              />
              {this.errorMessage("mobile")}
            </div>
            <div className="field">
              <input
                className="input"
                type="text"
                placeholder="请输入验证码"
                value={formState.code}
                onChange={this.updateFormState}
                onInput={this.validateCode}
                onBlur={this.validateCode}
                name="code"
              />
              {this.errorMessage("code")}
            </div>
            <div className="field">
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formState.agree}
                  onChange={this.updateFormState}
                  onInput={this.validateAgree}
                />
                <span className="is-size-7 ml-1">
                  我已阅读并同意「用户协议」和「隐私条款」
                </span>
              </label>
              {this.errorMessage("agree")}
            </div>
            <div className="field">
              <button className="button is-info is-fullwidth">登录</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (
  dispatch: AppDispatch
) => ({
  // 保存用户凭证
  saveCredentials: (credentials: Credentials) =>
    dispatch(UserCreators.saveCredentials(credentials)),
});

export default connect(null, mapDispatchToProps)(LoginPage);
