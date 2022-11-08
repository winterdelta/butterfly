import {
	ImageSearchAlt,
	MicrophoneFilled,
	Locked,
	StopFilled,
	Fire,
} from "@carbon/icons-react";
import styles from "../../styles/form.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
// import MicRecorder from "";
import Router from "next/router";
import { useRouter } from "next/router";
// import { DateTime } from "luxon";
import Image from "next/image";
const MicRecorder = require("mic-recorder-to-mp3");

export default function Form () {
	// 2 prototype state hooks
	const [recording, setRecording] = useState(false);
	const [transcript, setTranscript] = useState(false);

	const [uploadedImage, setImage] = useState();
	const [imageName, setImageName] = useState();

	const [timer, setTimer] = useState(false);
	const [countdown, setCountdown] = useState(59);

	const [audioBlob, setAudioBlob] = useState(null);
	const [blobURL, setBlobUrl] = useState("");
	const [audioFile, setAudioFile] = useState(null);

	const [isRecording, setIsRecording] = useState(false);

	const [isPlaying, setIsPlaying] = useState(false);
	const [transcription, setTranscription] = useState("");
	const [audioURLFromS3, setAudioURL] = useState(null);

	const [recordingTime, setRecordingTime] = useState();

	const recorder = useRef(null); //Recorder

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		//Declares the recorder object and stores it inside of ref
		recorder.current = new MicRecorder({ bitRate: 128 });
	}, []);

	const startRecording = () => {
		// Check if recording isn't blocked by browser
		recorder.current.start().then(() => {
			setIsRecording(true);
		});
	};

	const stopRecording = () => {
		recorder.current
			.stop()
			.getMp3()
			.then(([Buffer, Blob]) => {
				const file = new File(Buffer, "audio.mp3", {
					type: Blob.type,
					lastModified: Date.now(),
				});
				setAudioBlob(Blob);
				const newBlobUrl = URL.createObjectURL(Blob);
				setBlobUrl(newBlobUrl);
				setIsRecording(false);
				setAudioFile(file);
				// console.log(DateTime.fromSeconds(file.lastModified));
				// console.log(new Date(file.lastModified).toString());
				setRecordingTime(file.lastModified);
			});
	};

	const toggle = () => {
		setRecording(!recording);
		setTranscript(!transcript);
		setTimer(!timer);
	};

	useEffect(() => {
		if (timer) {
			if (countdown > 0) {
				setTimeout(() => setCountdown(countdown - 1), 1000);
			} else {
				setCountdown(0);
				setTranscript(true);
			}
		} else {
			setCountdown(59);
			setTimer(false);
		}
	}, [countdown, timer]);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		if (audioBlob) {
			submitVoiceMemo();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [audioBlob]);

	const submitVoiceMemo = async () => {
		const response = await fetch("/api/download-audio", {
			method: "POST",
			body: audioBlob,
		});
		const data = await response.json();
		setTranscription(data.DString);
		setAudioURL(data.audioURL);
		// console.log(data.DString);
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const uploadPhoto = async (e) => {
		const target = e.target
		const file = target.files[0]

		setImage(URL.createObjectURL(file));

		const filename = uuidv4();
		setImageName(filename);

		const fileType = encodeURIComponent(file.type);
		const res = await fetch(
			`/api/upload-url?file=${filename}&fileType=${fileType}`
		);
		const { url, fields } = await res.json();
		const formData = new FormData();

		Object.entries({ ...fields, file }).forEach(([key, value]) => {
			formData.append(key, value);
		});

		const upload = await fetch(url, {
			method: "POST",
			body: formData,
		});

		if (upload.ok) {
			console.log("");
		} else {
			console.error("Upload failed.");
		}
	};

	const handleTextAreaChange = (event) => {
		setTranscription(event.target.value);
	};

	const router = useRouter();

	const onSubmit = handleSubmit(async (formData) => {
		try {
			const res = await fetch("/api/appendPost", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					audioURLFromS3,
					formData,
					imageName,
					recordingTime,
				}),
			});
			if (res.status === 200) {
				// router.reload()
				setTranscription("");
				setImage("")
			} else {
				throw new Error(await res.text());
			}
		} catch (error) {
			console.error(error);
		}
	});

	return (
		<div className={styles.form}>
			{/* {uploadedImage && (
					<Image height={100} width={100} src={uploadedImage} alt='' />
				)} */}
			<label
				style={{
					backgroundImage: uploadedImage
						? `url(${uploadedImage})`
						: "/cat.png",
				}}
				className={styles.imageUploader}
			>
				<input
					className={styles.fileInput}
					onChange={uploadPhoto}
					type='file'
					accept='image/png, image/jpeg'
				/>
				<ImageSearchAlt size='24' />
			</label>
			<div
				onClick={isRecording ? stopRecording : startRecording}
				className={styles.microphone}
			>
				{isRecording ? (
					<button className={styles.stopGlow}>
						<StopFilled size='32' />
					</button>
				) : (
					<button className={styles.microphoneButton}>
						<MicrophoneFilled size='32' />
					</button>
				)}
			</div>
			{/* {blobURL && <audio controls src={blobURL} />} */}
			{/* <div className={inter.className}>
					{recording ? (
						<div className={styles.time}>
							{countdown == 0 ? null : "00:"}
							{countdown}
						</div>
					) : (
						<div className={styles.time}>
							00<span className={styles.blinkingColon}>:</span>00
						</div>
					)}
				</div> */}
			{transcription && (
				<form className={styles.transForm} onSubmit={handleSubmit(onSubmit)}>
					<textarea
						value={transcription}
						className={styles.transcript}
						// @ts-ignore
						{...register("transcription", {
							maxLength: 1000,
						})}
						onChange={handleTextAreaChange}
					></textarea>
					<button className={styles.sendBtn} type='submit'>

						<Fire size='24' />

					</button>
				</form>
			)}
			{/* <div className={styles.lock}>
					<Locked size='16' />
				</div> */}

		</div>
	);
}
