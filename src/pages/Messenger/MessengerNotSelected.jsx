import classNames from 'classnames/bind';
import styles from './Messenger.module.scss';

const cx = classNames.bind(styles);

function MessengerNotFound() {
    return (
        <div className={cx('messenger__not__selected__wrapper')}>
            <p>Select a chat or start a new conversation</p>
        </div>
    );
}

export default MessengerNotFound;
