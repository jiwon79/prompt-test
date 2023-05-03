import styles from './Dialog.module.scss';
import Message from "../../model/Message";
import classNames from "classnames";
import {ChatCompletionRequestMessageRoleEnum} from "openai";

interface DialogProps {
  messages: Message[];
  isLoading: boolean;
}

const Dialog = ({messages, isLoading}: DialogProps) => {
  const RoleEnum = ChatCompletionRequestMessageRoleEnum;

  return (
    <div className={styles.dialog}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={classNames(
            {[styles.user]: message.role === RoleEnum.User},
            {[styles.assistant]: message.role === RoleEnum.Assistant},
            {[styles.system]: message.role === RoleEnum.System},
            styles.chat
          )}
        >{message.content}</div>
      ))}
    </div>
  );
};

export default Dialog;
