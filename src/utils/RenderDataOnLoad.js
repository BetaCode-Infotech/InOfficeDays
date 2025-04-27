import {useEffect} from 'react';
import {connect} from 'react-redux';
import {getSessionDataAction} from '../Redux/Action/getSessionData';
import {getAllEventData} from '../Redux/Action/getAllEventData';

const RenderDataOnLoad = props => {
  useEffect(() => {
    if (props.AUTH_DATA?.SESSION_ID) {
      props.getSessionDataAction(props.AUTH_DATA?.SESSION_ID);
      // props.getAllEventData(props.AUTH_DATA?.USER_ID,);
      // props.getMyEventData(props.AUTH_DATA?.SESSION_ID);
    }
  }, []);
};

const mapStateToProps = state => ({
  AUTH_DATA: state.authData.authDataList,
});

export default connect(mapStateToProps, {
  getSessionDataAction,
})(RenderDataOnLoad);
