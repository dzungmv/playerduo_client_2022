import classNames from 'classnames/bind';

import styles from './GlobalChat.module.scss';

const cx = classNames.bind(styles);

function CanvasBody() {
    return <h1 className={cx('body')}>Hello guy</h1>;
}

export default CanvasBody;
