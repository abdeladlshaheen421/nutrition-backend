import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';


import Assistant from '../models/assistant.model';
import { Role } from './client.controller';
dotenv.config();

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;
const secretKey = process.env.TOKEN_SECRET as jwt.Secret;

export type AssistantType = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  clinic: string;
  image?: string;
};

export class AssistantController {
  async setPassword(password: string): Promise<string> {
    const hashedPassword = bcrypt.hashSync(
      password + BCRYPT_PASSWORD,
      parseInt(SALT_ROUNDS as string)
    );
    return hashedPassword;
  }

  async validPassword(
    password: string,
    assistantPassword: string
  ): Promise<boolean> {
    return bcrypt.compareSync(password + BCRYPT_PASSWORD, assistantPassword);
  }

  async generateJWT(assistant: AssistantType): Promise<string> {
    return jwt.sign(
      {
        id: assistant._id,
        email: assistant.email,
        role: Role.ASSISTANT,
      },
      secretKey,
      { expiresIn: '24h' }
    );
  }

  async login(email: string, password: string): Promise<AssistantType | null> {
    try {
      const assistant = await Assistant.findOne({ email: email });
      if (assistant) {
        if (await this.validPassword(password, assistant.password)) {
          return assistant;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Could not find this assistant ${email} => ${err}`);
    }
  }

  async index(): Promise<AssistantType[] | null> {
    try {
      const assistants = await Assistant.find();
      return assistants;
    } catch (err) {
      throw new Error(`Could not find any assistants => ${err}`);
    }
  }

  async create(assistant: AssistantType): Promise<AssistantType | null> {
    try {
      const newAssistant = new Assistant(assistant);
      newAssistant.password = await this.setPassword(
        assistant.password as string
      );
      return await newAssistant.save();
    } catch (err) {
      throw new Error(`Could not create this assistant => ${err}`);
    }
  }

  async update(
    id: string,
    assistant: AssistantType
  ): Promise<AssistantType | null> {
    try {
      const updatedAssistant = await Assistant.findByIdAndUpdate(
        id,
        assistant,
        {
          new: true,
          projection: { password: 0 },
        }
      );
      return updatedAssistant;
    } catch (err) {
      throw new Error(`Could not update this assistant => ${err}`);
    }
  }

  async show(id: string): Promise<AssistantType | null> {
    try {
      const assistantToShow = await Assistant.findById(id, '-password');
      return assistantToShow;
    } catch (err) {
      throw new Error(`Could not show this assistant => ${err}`);
    }
  }

  async delete(id: string): Promise<AssistantType | null> {
    try {
      const deletedAssistant = await Assistant.findByIdAndDelete(id, {
        projection: { password: 0 },
      });
      return deletedAssistant;
    } catch (err) {
      throw new Error(`Could not delete this assistant => ${err}`);
    }
  }

  async showAssistantsClinic(
    clinicId: string
  ): Promise<AssistantType[] | null> {
    try {
      const assistantsClinic = await Assistant.find(
        { clinic: clinicId },
        '-password'
      );
      return assistantsClinic;
    } catch (err) {
      throw new Error(`Could not show assistants of this clinic => ${err}`);
    }
  }

  async findByPassword(
    assistantId: string,
    password: string
  ): Promise<AssistantType | null> {
    try {
      const assistant = await Assistant.findOne({
        _id: assistantId,
      });
      if (await this.validPassword(password, assistant.password)) {
        return assistant;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Could not find this assistant => ${err}`);
    }
  }

  async updatePassword(id: string, password: string): Promise<AssistantType> {
    try {
      const hash = await this.setPassword(password);
      const updatedAssistant = await Assistant.findByIdAndUpdate(
        id,
        { password: hash },
        { new: true }
      );
      return updatedAssistant;
    } catch (err) {
      throw new Error(`Could not update this Assistant => ${err}`);
    }
  }
}
