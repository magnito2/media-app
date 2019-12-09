import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import Create from "../create.component";
import Edit from "../edit.component";
import Index from "../index.component";

class Landing extends Component {
    render() {
        return (
            <div style={{ height: "75vh" }} className="container valign-wrapper">
                <div className="row">
                    <div className="col s12 center-align">
                        <h4>
                            <span style={{ fontFamily: "monospace" }}><b>e</b>-Daro</span>
                        </h4>
                        <p className="flow-text grey-text text-darken-1">
                            Freedom to teach
                        </p>
                        <br />
                        <div className="col s6">
                            <Link
                                to="/register"
                                style={{
                                    width: "140px",
                                    borderRadius: "3px",
                                    letterSpacing: "1.5px"
                                }}
                                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                            >
                                Register
                            </Link>
                        </div>
                        <div className="col s6">
                            <Link
                                to="/login"
                                style={{
                                    width: "140px",
                                    borderRadius: "3px",
                                    letterSpacing: "1.5px"
                                }}
                                className="btn btn-large btn-flat waves-effect white black-text"
                            >
                                Log In
                            </Link>
                        </div>
                        <Switch>
                            <Route exact path='/create' component={ Create } />
                            <Route path='/edit/:id' component={ Edit } />
                            <Route path='/index' component={ Index } />
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}
export default Landing;