import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import { useSelector } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames/bind';
import styles from './Transaction.module.scss';

const cx = classNames.bind(styles);

function Topup() {
    const topup = useSelector((state) => state?.user?.user?.topup);
    return (
        <div className={cx('topup__wrapper')}>
            {topup && topup.length > 0 ? (
                <CTable>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell
                                scope='col'
                                style={{
                                    width: '10%',
                                    // display: 'flex',
                                    // alignItems: 'center',
                                    // justifyContent: 'center',
                                }}
                            >
                                ID
                            </CTableHeaderCell>
                            <CTableHeaderCell
                                scope='col'
                                style={{ width: '45%' }}
                            >
                                Amount top up
                            </CTableHeaderCell>
                            <CTableHeaderCell
                                scope='col'
                                style={{ width: '45%' }}
                            >
                                Date top up
                            </CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>

                    <CTableBody>
                        {topup.map((item, index) => {
                            return (
                                <CTableRow key={item.id}>
                                    <CTableHeaderCell scope='row'>
                                        {index + 1}
                                    </CTableHeaderCell>
                                    <CTableDataCell>
                                        {item.amount.toLocaleString()}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {moment(item?.created_at).calendar()}
                                    </CTableDataCell>
                                </CTableRow>
                            );
                        })}
                    </CTableBody>
                </CTable>
            ) : (
                "You don't have any topup history"
            )}
        </div>
    );
}

export default Topup;
