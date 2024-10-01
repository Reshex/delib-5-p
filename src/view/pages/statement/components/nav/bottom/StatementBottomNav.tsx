import React, { FC, useState } from "react";

// Third party libraries
import { Statement, Screen, StatementType } from "delib-npm";
import { Link, useParams } from "react-router-dom";

// Icons

import PlusIcon from "@/assets/icons/plusIcon.svg?react";
import AgreementIcon from "@/assets/icons/agreementIcon.svg?react";
import RandomIcon from "@/assets/icons/randomIcon.svg?react";
import UpdateIcon from "@/assets/icons/updateIcon.svg?react";
import NewestIcon from "@/assets/icons/newIcon.svg?react";
import SortIcon from "@/assets/icons/sort.svg?react";

import useStatementColor from "@/controllers/hooks/useStatementColor";
import {
	NavItem,
	optionsArray,
	questionsArray,
	votesArray,
} from "./StatementBottomNavModal";

import "./StatementBottomNav.scss";
import StartHere from "@/view/components/startHere/StartHere";
import { useSelector } from "react-redux";
import { userSettingsSelector } from "@/model/users/userSlice";
import { decreesUserSettingsLearningRemain } from "@/controllers/db/learning/setLearning";

interface Props {
  statement: Statement;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showNav?: boolean;
}

const StatementBottomNav: FC<Props> = ({ setShowModal, statement }) => {
	const { page } = useParams();

	const navItems = getNavigationScreens(page);
	const timesRemainToLearnAddOption = useSelector(userSettingsSelector)?.learning?.addOptions || 0;
  

	const [isNavigationOpen, setIsNavigationOpen] = useState(false);
	const [showSorting, setShowSorting] = useState(false);
	const [showStartHere, setShowStartHere] = useState(timesRemainToLearnAddOption > 0);

	const statementColor = useStatementColor(
		statement.statementType || StatementType.statement
	);

	//used to check if the user can add a new option in voting and in evaluation screens
	const addOption: boolean | undefined =
    statement.statementSettings?.enableAddEvaluationOption;

	const addVotingOption: boolean | undefined =
    statement.statementSettings?.enableAddVotingOption;

	const showAddOptionEvaluation = page === Screen.OPTIONS && addOption;
	const showAddOptionVoting = page === Screen.VOTE && addVotingOption;
	const showAddQuestion = page === Screen.QUESTIONS;
	const isAddOption =
    showAddOptionEvaluation || showAddOptionVoting || showAddQuestion;

	const handleAddOption = () => {
		if (isAddOption) {
			setShowModal(true);
	  setShowStartHere(false);
	  decreesUserSettingsLearningRemain({addOption: true});

		}
	};

	function handleSortingClick() {
		setShowSorting(!showSorting);
	}

	return (
		<>
			{isNavigationOpen && (
				<div
					className="invisibleBackground"
					onClick={() => setIsNavigationOpen(false)}
				/>
			)}
			<div className={showSorting?"statement-bottom-nav statement-bottom-nav--show":"statement-bottom-nav"}>
				<button
					className="add-option-button"
					style={statementColor}
					onClick={handleMidIconClick}
					data-cy="bottom-nav-mid-icon"
				>
					{isAddOption && <PlusIcon style={{ color: statementColor.color }} />}
				</button>
			<div
				className={
					showSorting
						? "statement-bottom-nav statement-bottom-nav--show"
						: "statement-bottom-nav"
				}
			>
				<div className="add-option-button-wrapper">
					{showStartHere && <StartHere setShow={setShowStartHere} />}
					<button
						className="add-option-button"
						aria-label="Add option"
						style={statementColor}
						onClick={handleAddOption}
						data-cy="bottom-nav-mid-icon"
					>
						{isAddOption && (
							<PlusIcon style={{ color: statementColor.color }} />
						)}
					</button>
				</div>
				<div className="sort-menu">
					{navItems.map((navItem, i) => (
						<div
							key={`item-id-${i}`}
							className={`sort-menu__item  ${showSorting ? "active" : ""}`}
						>
							<Link
								className={`open-nav-icon ${showSorting ? "active" : ""}`}
								to={navItem.link}
								key={navItem.id}
								onClick={() => setShowSorting(false)}
							>
								<NavIcon
									name={navItem.name}
									color={statementColor.backgroundColor}
								/>
							</Link>
							<span className="button-name">{navItem.name}</span>
						</div>
					))}
					<div className="sort-button" onClick={handleSortingClick}>
					<button
						className="sort-button"
						onClick={handleSortingClick}
						aria-label="Sort items"
					>
						<SortIcon />
					</div>
				</div>
			</div>
		</>
	);
};

export default StatementBottomNav;

function getNavigationScreens(page: string | undefined): NavItem[] {
	if (!page) return optionsArray;

	switch (page) {
	case Screen.VOTE:
		return votesArray;
	case Screen.OPTIONS:
		return optionsArray;
	case Screen.QUESTIONS:
		return questionsArray;
	default:
		return optionsArray;
	}
}

interface NavIconProps {
  name: string;
  color: string;
}

const NavIcon: FC<NavIconProps> = ({ name, color }) => {
	const props = { style: { color } };
	switch (name) {
	case "New":
		return <NewestIcon {...props} />;
	case "Update":
		return <UpdateIcon {...props} />;
	case "Random":
		return <RandomIcon {...props} />;
	case "Agreement":
		return <AgreementIcon {...props} />;
	default:
		return null;
	}
};
