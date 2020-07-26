import React from 'react'
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom'
import {Dropdown} from 'react-bootstrap'
import './App.css'
import { isNull } from 'util'



const Dashboard = () => {
    const authInstance = window.gapi.auth2.getAuthInstance()
    const user = authInstance.currentUser.get()
    const profile = user.getBasicProfile()
    const email = profile.getEmail()
    const imageUrl = profile.getImageUrl()

    return (
        <>
            <nav>
                <div>Phase1</div>
                <img className="push" src={imageUrl}/>
                <Dropdown>
                    <Dropdown.Toggle as="a">
                        {email}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={authInstance.signOut}>Sign out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </nav>
            <div className="container">
                
                <p>Welcome to Phase 1 {profile.getGivenName()}</p>
                <img src={imageUrl} />
            </div>
        </>
    )
}

class LoginPage extends React.Component {
    componentDidMount() {
        window.gapi.load('signin2', () => {
            window.gapi.signin2.render('login-button',{})
        })
    }

    render() {
        return (
            <div className="container">
                <div id="login-button">Sign in with Google</div>
            </div>
        )
    }
}

const LandingPage = () => {
    return (
        <div className="container">
            <h1>Phase1</h1>
            <p>Continue to see my phase 1 project</p>
            <Link to="/dashboard">Go to Dashboard</Link>
        </div>
    )
}


class App extends React.Component<{},any> {
    constructor(props:any) {
        super(props)

        this.state = {
            isSignedIn: null
        }
    }

    initializeGoogleSignIn() {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: '128117876174-p2f533hl0f2pa41hgsmtmd22s0b44d84.apps.googleusercontent.com'
        }).then(() => {
          const authInstance =  window.gapi.auth2.getAuthInstance()
          const isSignedIn = authInstance.isSignedIn.get()
          this.setState({isSignedIn})

          authInstance.isSignedIn.listen(isSignedIn => {
            this.setState({isSignedIn})
          })
        })
      })
    }

    componentDidMount() {
      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/platform.js'
      script.onload = () => this.initializeGoogleSignIn()
      document.body.appendChild(script)
    }

    ifUserSignedIn(Component: any) {
        if (this.state.isSignedIn === null) {
            return (
                <h1>Checking if you're signed in...</h1>
            )
        }
        return this.state.isSignedIn ?
            <Component/> :
            <LoginPage/>
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/">
                        <LandingPage/>
                    </Route>
                    <Route path="/dashboard" render={() => this.ifUserSignedIn(Dashboard)}/>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default App