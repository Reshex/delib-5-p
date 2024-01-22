import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LobbyRooms, RoomAskToJoin, Statement } from 'delib-npm';
import { updateArray } from '../../functions/general/helpers';
import { z } from 'zod';
import { RootState } from '../store';

export interface RoomAdmin {
    room: Array<RoomAskToJoin>;
    roomNumber: number;
    statement: Statement;
}
interface RoomsState {
    rooms: RoomAskToJoin[];
    askToJoinRooms: RoomAskToJoin[];
    lobbyRooms: LobbyRooms[];
}

const initialState: RoomsState = {
    rooms: [],
    askToJoinRooms: [],
    lobbyRooms: [],
};

export const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        setAskToJoinRooms: (
            state,
            action: PayloadAction<{
                request: RoomAskToJoin | undefined;
                parentId: string;
            }>,
        ) => {
            try {
                const { request, parentId } = action.payload;

                if (!request) {
                    //remove preivous room request

                    state.askToJoinRooms = state.askToJoinRooms.filter(
                        (room) => room.parentId !== parentId,
                    );

                    return;
                }

                //set request to join room
                state.askToJoinRooms = updateArray(
                    state.askToJoinRooms,
                    request,
                    "requestId",
                );
            } catch (error) {
                console.error(error);
            }
        },
        setRoomRequests: (state, action: PayloadAction<RoomAskToJoin[]>) => {
            try {
                const requests = action.payload;
                z.array(z.any()).parse(requests);

                state.askToJoinRooms = requests;
            } catch (error) {
                console.error(error);
            }
        },
        removeFromAskToJoinRooms: (state, action: PayloadAction<string>) => {
            try {
                const requestId = action.payload;
                state.askToJoinRooms = state.askToJoinRooms.filter(
                    (room) => room.requestId !== requestId,
                );
            } catch (error) {
                console.error(error);
            }
        },
    },
});

export const { setAskToJoinRooms, setRoomRequests, removeFromAskToJoinRooms } = roomsSlice.actions;

export const participantsSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.rooms.askToJoinRooms.filter(
            (room) => room.parentId === statementId,
        );

export const askToJoinRoomsSelector = (state: RootState) =>
    state.rooms.askToJoinRooms;
export const askToJoinRoomSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.rooms.askToJoinRooms.find(
            (room) => room.statementId === statementId,
        );
export const userSelectedRoomSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.rooms.askToJoinRooms.find(
            (room) =>
                room.participant.uid === state.user.user?.uid &&
                room.parentId === statementId,
        );
export const topicParticipantsSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.rooms.askToJoinRooms.filter(
            (room) => room.statementId === statementId,
        );

//find the user selected topic
export const userSelectedTopicSelector =
    (parentId: string | undefined) => (state: RootState) =>
        state.rooms.askToJoinRooms.find(
            (room) =>
                room.participant.uid === state.user.user?.uid &&
                room.parentId === parentId,
        );

//loby rooms
export const lobbyRoomsSelector = (state: RootState) =>
    state.rooms.lobbyRooms;
export const lobbyRoomSelector =
    (statementId: string | undefined) => (state: RootState) =>
        state.rooms.lobbyRooms.find(
            (room) => room.statementId === statementId,
        );

export default roomsSlice.reducer;
