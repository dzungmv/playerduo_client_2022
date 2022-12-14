import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';

import styles from './Sidebar.module.scss';
import Image from '@/components/Image';

const cx = classNames.bind(styles);

function Sidebar() {
    const navigate = useNavigate();
    const gameList = useSelector((state) => state?.games?.games);

    const handleFilterGameByID = (id) => {
        navigate(`/filter/games/${id}`);
    };

    return (
        <div className={cx('wrapper')}>
            <span className={cx('title')}>Game list</span>
            <div className={cx('game')}>
                {gameList.map((data) => {
                    return (
                        <div
                            key={data.id}
                            className={cx('list-item')}
                            onClick={() => {
                                handleFilterGameByID(data.id);
                            }}
                        >
                            <Image
                                className={cx('item__icon')}
                                src={data.gameImg}
                            />
                            <span className={cx('item__label')}>
                                {data.game}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Sidebar;
