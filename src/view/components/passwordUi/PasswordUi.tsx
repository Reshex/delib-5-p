import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { checkPassword } from './checkPassword.ts';

//styles
import styles from './passwordUi.module.scss';

//images
import passwordUiImgBlue from '../../../assets/images/passwordUiImgBlue.png';
import passwordUiImgRed from '../../../assets/images/passwordUiImgRed.png';
import passwordUiImgGreen from '../../../assets/images/passwordUiImgGreen.png';

//custom components
import Button from '../buttons/button/Button';
import PasswordInput from './PasswordInput.tsx';
import { useLanguage } from '@/controllers/hooks/useLanguages';

interface PasswordUiProps {
	setPasswordCheck: React.Dispatch<React.SetStateAction<boolean>>;
	statementId: string | undefined;
	userId: string | undefined
}

export default function PasswordUi({ setPasswordCheck, statementId, userId }: PasswordUiProps) {
	const navigate = useNavigate();
	const { t } = useLanguage();

	const PASSWORD_LENGTH = 4;
	const MAX_TRIES = 3;

	const [triesCounter, setTriesCounter] = useState(MAX_TRIES);
	const [values, setValues] = useState(Array(PASSWORD_LENGTH).fill(''));
	const [passwordState, setPasswordState] = useState({
		img: passwordUiImgBlue,
		text: t('Enter your 4-digit passcode to unlock group access'),
		textStyle: styles.passwordUi__statusSection__passwordTextDefault,
	});


	async function handleSubmit() {
		try {
			if (!statementId) {
				throw new Error("No statement ID found");
			}
			if (!userId) {
				throw new Error("No user ID found");
			}

			const userCodeInput = Number(values.join(''));

			const isPasswordCorrect = await checkPassword(userCodeInput, statementId, userId);

			if (isPasswordCorrect) {
				setPasswordState({
					img: passwordUiImgGreen,
					text: t('Bravo! Your password is correct. Welcome aboard!'),
					textStyle: styles.passwordUi__statusSection__passwordTextCorrect,
				});

				setTimeout(() => {
					setPasswordCheck(true);
				}, 1000);
			} else {
				setPasswordState({
					img: passwordUiImgRed,
					text: t('Something went wrong. Please try again!'),
					textStyle: styles.passwordUi__statusSection__passwordTextIncorrect,
				});

				setTriesCounter((prev) => {
					const newTriesCounter = prev - 1;
					if (newTriesCounter <= 0) {
						navigate('/401');
					}
					
					return newTriesCounter;
				});
			}
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<div className={styles.passwordUi}>
			<img src={passwordState.img} />

			<div className={styles.passwordUi__statusSection}>
				<p className={passwordState.textStyle}>{passwordState.text}</p>
			</div>

			<div className={styles.passwordUi__inputSection}>
				<PasswordInput
					handleSubmit={handleSubmit}
					passwordLength={PASSWORD_LENGTH}
					values={values}
					setValues={setValues}
				/>
			</div>

			<div className={styles.passwordUi__triesLeft}>
				<p>Tries Left = {triesCounter}</p>
			</div>

			<div className={styles.passwordUi__buttonSection}>
				<Button
					text={t('Submit')}
					onClick={handleSubmit}
					className='btn btn--affirmation'
				/>
			</div>
		</div>
	);
}
