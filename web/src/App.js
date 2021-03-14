import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import "./App.css"

function App() {
	const [ user, setUser ] = useState({ message: "", name: "L" })
	const [ chat, setChat ] = useState([])

	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000")
			socketRef.current.on("message", ({ name, message }) => {
				setChat([ ...chat, { name, message } ])
			})
			return () => socketRef.current.disconnect()
		},
		[ chat ]
	)

	const onTextChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		const { name, message } = user
		socketRef.current.emit("message", { name, message })
		e.preventDefault()
		setUser({ message: "", name })
	}

	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3 style={{textAlign:user.name===name?"right":"left"}}>
					{name}: <span>{message}</span>
				</h3>
			</div>
		))
	}

	return (
		<div className="card">
			<form onSubmit={onMessageSubmit}>
				<h1>Messanger</h1>
				<div className="name-field">
					<TextField name="name" onChange={(e) => onTextChange(e)} value={user.name} label="Name" />
				</div>
				<div>
					<TextField
				     	autoFocus={true}
						name="message"
						onChange={(e) => onTextChange(e)}
						value={user.message}
						id="outlined-multiline-static"
						variant="outlined"
						label="Message"
					/>
				</div>
				<button>Send Message</button>
			</form>
			<div className="render-chat">
				<h1>Chat Log</h1>
				{renderChat()}
			</div>
		</div>
	)
}

export default App

