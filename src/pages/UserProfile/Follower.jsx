import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';

import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

function Follower() {
    const user = useSelector((state) => state?.user?.user?.follower);
    return (
        <div className={cx('follower__container')}>
            <div className={cx('container')}>
                {user.followerData && user.followerData.length > 0
                    ? user?.followerData.map((item) => {
                          return (
                              <div className={cx('item')} key={item.player_id}>
                                  <div className={cx('user__info')}>
                                      <div className={cx('user__avatar')}>
                                          <img src={item.avatar} alt='avatar' />
                                      </div>
                                      <div className={cx('user__name')}>
                                          {item.nickname}
                                      </div>
                                  </div>

                                  <div className={cx('male')}>
                                      {item.gender}
                                  </div>
                              </div>
                          );
                      })
                    : 'No follower'}
            </div>
        </div>
    );
}

export default Follower;
