import classNames from 'classnames/bind';

import styles from './LoadingIcon.module.scss';

const cx = classNames.bind(styles);

function Loading_Icon() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('lds-ripple')}>
                <div></div>
                <div></div>
            </div>
            {/* <div className={cx('loader')}>
                <div className={cx('dot')}></div>
                <div className={cx('dot')}></div>
                <div className={cx('dot')}></div>
                <div className={cx('dot')}></div>
                <div className={cx('dot')}></div>
            </div> */}
        </div>
    );
}

export default Loading_Icon;
