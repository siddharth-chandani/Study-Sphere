
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";


const Protected = ({ isAuthenticated, Comp, email,saved }) => {
  return (
    
      isAuthenticated?
      <Comp saved={saved} email={email} />:
      <Navigate to='/login' />
    
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Protected);
