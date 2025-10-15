// tests/unit/client.controller.test.ts
import { Request, Response } from 'express';
import * as controller from '../../src/modules/client/client.controller';
import * as service from '../../src/modules/client/client.service';
import { generateResponse } from '../../src/utils/generateResponse';
import { AppError } from '../../src/utils/appError';
import { ClientCreateDTO, ClientUpdateDTO } from '../../src/modules/client/client.types';

jest.mock('../../src/modules/client/client.service');
jest.mock('../../src/utils/generateResponse');

const mockClient = {
  id: 'client-123',
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Test St',
  dob: new Date('1990-01-01'),
  email: 'john@example.com',
  cell: '123-456-7890',
  companyName: 'Test Corp',
  price: '1000',
  comments: 'Test client',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockClientsList = {
  data: [mockClient],
  pagination: {
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
    sortOrder: 'desc',
  },
};

const mockReq = (overrides: Partial<Request> = {}): Request => ({
  body: {},
  params: {},
  query: {},
  ...overrides,
} as Request);

const mockRes = (): Response => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    locals: {},
  } as unknown as Response;
  return res;
};

const mockNext = jest.fn();

describe('Client Controller Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createClient', () => {
    it('should create client successfully', async () => {
      const req = mockReq({
        body: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Test St',
          dob: '1990-01-01',
          email: 'john@example.com',
          cell: '123-456-7890',
          companyName: 'Test Corp',
          price: '1000',
        } as ClientCreateDTO,
      });
      const res = mockRes();
      (service.createClientService as jest.Mock).mockResolvedValue(mockClient);

      await controller.createClient(req, res, mockNext);

      expect(service.createClientService).toHaveBeenCalledWith(req.body);
      expect(generateResponse).toHaveBeenCalledWith(
        res,
        201,
        'Client created successfully',
        mockClient
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const req = mockReq({ body: {} as ClientCreateDTO });
      const res = mockRes();
      const error = new AppError('Validation failed', 400);
      (service.createClientService as jest.Mock).mockRejectedValue(error);

      await controller.createClient(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(generateResponse).not.toHaveBeenCalled();
    });
  });

  describe('getClients', () => {
    it('should get all clients with pagination', async () => {
      const req = mockReq({
        query: { page: '2', limit: '5', sortOrder: 'asc' },
      });
      const res = mockRes();
      (service.listClientsService as jest.Mock).mockResolvedValue(mockClientsList);

      await controller.getClients(req, res, mockNext);

      expect(service.listClientsService).toHaveBeenCalledWith(2, 5, 'asc');
      expect(generateResponse).toHaveBeenCalledWith(
        res,
        200,
        'Clients fetched successfully',
        mockClientsList
      );
    });

    it('should use default pagination parameters', async () => {
      const req = mockReq({ query: {} });
      const res = mockRes();
      (service.listClientsService as jest.Mock).mockResolvedValue(mockClientsList);

      await controller.getClients(req, res, mockNext);

      expect(service.listClientsService).toHaveBeenCalledWith(1, 10, 'desc');
    });

    it('should handle pagination errors', async () => {
      const req = mockReq({ query: {} });
      const res = mockRes();
      const error = new AppError('Invalid pagination', 400);
      (service.listClientsService as jest.Mock).mockRejectedValue(error);

      await controller.getClients(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getClient', () => {
    it('should get client by ID successfully', async () => {
      const req = mockReq({ params: { id: 'client-123' } });
      const res = mockRes();
      (service.getClientService as jest.Mock).mockResolvedValue(mockClient);

      await controller.getClient(req, res, mockNext);

      expect(service.getClientService).toHaveBeenCalledWith('client-123');
      expect(generateResponse).toHaveBeenCalledWith(
        res,
        200,
        'Client fetched successfully',
        mockClient
      );
    });

    it('should handle not found errors', async () => {
      const req = mockReq({ params: { id: 'non-existent' } });
      const res = mockRes();
      const error = new AppError('Client not found', 404);
      (service.getClientService as jest.Mock).mockRejectedValue(error);

      await controller.getClient(req, res, mockNext);

      expect(service.getClientService).toHaveBeenCalledWith('non-existent');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateClient', () => {
    it('should update client successfully', async () => {
      const updatedClient = { ...mockClient, firstName: 'Updated John' };
      const req = mockReq({
        params: { id: 'client-123' },
        body: { firstName: 'Updated John', price: '2000' } as ClientUpdateDTO,
      });
      const res = mockRes();
      (service.updateClientService as jest.Mock).mockResolvedValue(updatedClient);

      await controller.updateClient(req, res, mockNext);

      expect(service.updateClientService).toHaveBeenCalledWith('client-123', {
        firstName: 'Updated John',
        price: '2000',
      });
      expect(generateResponse).toHaveBeenCalledWith(
        res,
        200,
        'Client updated successfully',
        updatedClient
      );
    });

    it('should handle update errors', async () => {
      const req = mockReq({
        params: { id: 'non-existent' },
        body: { firstName: 'Test' } as ClientUpdateDTO,
      });
      const res = mockRes();
      const error = new AppError('Client not found', 404);
      (service.updateClientService as jest.Mock).mockRejectedValue(error);

      await controller.updateClient(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteClient', () => {
    it('should delete client successfully', async () => {
      const req = mockReq({ params: { id: 'client-123' } });
      const res = mockRes();
      (service.deleteClientService as jest.Mock).mockResolvedValue(undefined);

      await controller.deleteClient(req, res, mockNext);

      expect(service.deleteClientService).toHaveBeenCalledWith('client-123');
      expect(generateResponse).toHaveBeenCalledWith(
        res,
        200,
        'Client deleted successfully'
      );
      expect(generateResponse).toHaveBeenCalledWith(
        expect.any(Object),
        200,
        'Client deleted successfully',
        undefined
      );
    });

    it('should handle delete errors', async () => {
      const req = mockReq({ params: { id: 'non-existent' } });
      const res = mockRes();
      const error = new AppError('Client not found', 404);
      (service.deleteClientService as jest.Mock).mockRejectedValue(error);

      await controller.deleteClient(req, res, mockNext);

      expect(service.deleteClientService).toHaveBeenCalledWith('non-existent');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});