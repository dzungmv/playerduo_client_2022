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
import 'moment-timezone';
import classNames from 'classnames/bind';
import styles from './Transaction.module.scss';

const cx = classNames.bind(styles);

function Withdraw() {
    const withdraw = useSelector((state) => state?.user?.user?.withdraw);

    return (
        <div className={cx('topup__wrapper')}>
            {withdraw && withdraw.length > 0 ? (
                <CTable>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope='col'>ID</CTableHeaderCell>
                            <CTableHeaderCell scope='col'>
                                Amount withdraw
                            </CTableHeaderCell>
                            <CTableHeaderCell>Service fee</CTableHeaderCell>

                            <CTableHeaderCell scope='col'>
                                Total actual amount
                            </CTableHeaderCell>
                            <CTableHeaderCell scope='col'>
                                Date withdraw
                            </CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {withdraw.map((item, index) => {
                            return (
                                <CTableRow key={item.id}>
                                    <CTableHeaderCell scope='row'>
                                        {index + 1}
                                    </CTableHeaderCell>
                                    <CTableDataCell>
                                        {(
                                            item.fee - item.amount
                                        ).toLocaleString()}{' '}
                                        VND
                                    </CTableDataCell>
                                    <CTableDataCell>10%</CTableDataCell>
                                    <CTableDataCell
                                        style={{
                                            color: 'red',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {(item.amount * -1).toLocaleString()}{' '}
                                        VND
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {moment(item?.created_at)
                                            .tz('Asia/Ho_Chi_Minh')
                                            .calendar()}
                                    </CTableDataCell>
                                </CTableRow>
                            );
                        })}
                    </CTableBody>
                </CTable>
            ) : (
                "You don't have any withdraw history"
            )}
        </div>
    );
}

export default Withdraw;
