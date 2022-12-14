import classNames from 'classnames/bind';

import styles from './Messenger.module.scss';

const cx = classNames.bind(styles);

function ActionTippy() {
    return (
        <div className={cx('tooltip')}>
            <div className={cx('tooltip__item')}>
                <i className={cx('fa-solid', 'fa-trash')}></i>
                <span>Delete Chat</span>
            </div>
        </div>
    );
}

export default ActionTippy;
