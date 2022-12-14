import { useState } from 'react';
import { COffcanvas, COffcanvasBody, COffcanvasHeader } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import Tippy from '@tippyjs/react';

import classNames from 'classnames/bind';
import Image from '@/components/Image';
import fake_data from './chat-data.json';
// import lol from '@/assets/icons/lol.jpg';

import styles from './GlobalChat.module.scss';

const cx = classNames.bind(styles);

function GlobalChat() {
    const [visible, setVisible] = useState(false);

    const handleOpen = () => {
        setVisible((prev) => !prev);
    };

    const [valueMess, setValueMess] = useState('');

    const handleSubmit = (e) => {};

    const handleInputChange = (e) => {
        setValueMess(e.target.value);
    };

    const checkKeyPress = (e) => {
        const { keyCode } = e;
        if (keyCode === 13) {
            alert(valueMess);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Tippy content='Chats Global' arrow={false} theme={'light'}>
                <div className={cx('btn-click')} onClick={handleOpen}>
                    <div
                        className={cx('fa-brands', 'fa-facebook-messenger')}
                    ></div>
                </div>
            </Tippy>
            <COffcanvas
                placement='start'
                visible={visible}
                onHide={() => setVisible(false)}
            >
                <COffcanvasHeader>
                    <div className={cx('header')}>
                        <div className={cx('title')}>Chats Global</div>
                        <div
                            className={cx('close-btn')}
                            onClick={() => setVisible(false)}
                        >
                            <i className={cx('fa-regular', 'fa-xmark')}></i>
                        </div>
                    </div>
                </COffcanvasHeader>
                <COffcanvasBody>
                    <div className={cx('mess')}>
                        {fake_data.map((data) => {
                            return (
                                <div key={data.id} className={cx('comment')}>
                                    <div className={cx('comment-avatar')}>
                                        <Image src={''} alt='' />
                                    </div>
                                    <div className={cx('comment-content')}>
                                        <div className={cx('content')}>
                                            <span className={cx('name')}>
                                                {data.name}
                                            </span>
                                            : {data.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </COffcanvasBody>

                <COffcanvasHeader>
                    <div className={cx('text__message')}>
                        <input
                            type='text'
                            placeholder='Aa'
                            value={valueMess}
                            onChange={handleInputChange}
                            onKeyDown={checkKeyPress}
                        />
                        <button onClick={handleSubmit}>Click</button>
                    </div>
                </COffcanvasHeader>
            </COffcanvas>
        </div>
    );
}

export default GlobalChat;
