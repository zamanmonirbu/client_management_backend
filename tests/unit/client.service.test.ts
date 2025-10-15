// tests/unit/client.service.test.ts
import * as service from '../../src/modules/client/client.service';
import * as repo from '../../src/modules/client/client.repository';
import { AppError } from '../../src/utils/appError';
import { ClientCreateDTO } from '../../src/modules/client/client.types';

jest.mock('../../src/modules/client/client.repository');

const mockClient = {
  id: 'client-123',
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Test St',
  dob: new Date('1990-01-01T00:00:00.000Z'),
  email: 'john.doe@example.com',
  cell: '123-456-7890',
  companyName: 'Test Corp',
  price: '1000',
  comments: 'Test client',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockClients = [
  { ...mockClient, id: 'client-1', firstName: 'Client 1' },
  { ...mockClient, id: 'client-2', firstName: 'Client 2' },
];

describe('Client Service Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createClientService', () => {
    it('should create client successfully', async () => {
      (repo.createClient as jest.Mock).mockResolvedValue(mockClient);

      const clientData: ClientCreateDTO = {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Test St',
        dob: '1990-01-01',
        email: 'john.doe@example.com',
        cell: '123-456-7890',
        companyName: 'Test Corp',
        price: '1000',
        comments: 'Test client',
      };

      const result = await service.createClientService(clientData);

      expect(repo.createClient).toHaveBeenCalledWith(expect.objectContaining({
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        address: clientData.address,
        email: clientData.email,
        dob: expect.any(Date),
        cell: clientData.cell,
        companyName: clientData.companyName,
        price: clientData.price,
        comments: clientData.comments,
      }));
      expect(result).toEqual(mockClient);
    });

    it('should throw AppError on repository failure', async () => {
      const dbError = new Error('Database connection failed');
      (repo.createClient as jest.Mock).mockRejectedValue(dbError);

      const clientData: ClientCreateDTO = {
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test Address',
        dob: '1990-01-01',
        email: 'test@example.com',
        cell: '123-456-7890',
        companyName: 'Test Corp',
        price: '1000',
      };

      await expect(service.createClientService(clientData)).rejects.toThrow(AppError);
      expect(repo.createClient).toHaveBeenCalledWith(expect.objectContaining(clientData));
    });
  });

  describe('listClientsService', () => {
    it('should list clients with proper pagination', async () => {
      const mockRepoResult = {
        clients: mockClients,
        total: 2,
      };
      (repo.findAllClients as jest.Mock).mockResolvedValue(mockRepoResult);

      const result = await service.listClientsService(1, 10, 'desc');

      expect(repo.findAllClients).toHaveBeenCalledWith(0, 10, 'desc');
      expect(result).toEqual({
        data: mockClients,
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
          sortOrder: 'desc',
        },
      });
    });

    it('should calculate totalPages correctly', async () => {
      const mockRepoResult = { clients: [], total: 25 };
      (repo.findAllClients as jest.Mock).mockResolvedValue(mockRepoResult);

      const result = await service.listClientsService(2, 10, 'asc');

      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.page).toBe(2);
    });

    it('should throw AppError for invalid pagination parameters', async () => {
      await expect(service.listClientsService(-1, 10, 'desc' as const)).rejects.toThrow(AppError);
      await expect(service.listClientsService(1, 0, 'desc' as const)).rejects.toThrow(AppError);
    });

    it('should use default parameters', async () => {
      const mockRepoResult = { clients: [], total: 0 };
      (repo.findAllClients as jest.Mock).mockResolvedValue(mockRepoResult);

      const result = await service.listClientsService();

      expect(repo.findAllClients).toHaveBeenCalledWith(0, 10, 'desc');
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });
  });

  describe('getClientService', () => {
    it('should get client successfully', async () => {
      (repo.findClientById as jest.Mock).mockResolvedValue(mockClient);

      const result = await service.getClientService('client-123');

      expect(repo.findClientById).toHaveBeenCalledWith('client-123');
      expect(result).toEqual(mockClient);
      expect(result.id).toBe('client-123');
    });

    it('should throw 404 AppError when client not found', async () => {
      (repo.findClientById as jest.Mock).mockResolvedValue(null);

      const error = await service.getClientService('non-existent').catch(e => e);
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Client not found');
      expect(repo.findClientById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('updateClientService', () => {
    it('should update client successfully', async () => {
      const updatedClient = {
        ...mockClient,
        firstName: 'Updated John',
        price: '2000',
        updatedAt: new Date(),
      };
      
      (repo.findClientById as jest.Mock).mockResolvedValue(mockClient);
      (repo.updateClientById as jest.Mock).mockResolvedValue(updatedClient);

      const updateData = {
        firstName: 'Updated John',
        price: '2000',
      };

      const result = await service.updateClientService('client-123', updateData);

      expect(repo.findClientById).toHaveBeenCalledWith('client-123');
      expect(repo.updateClientById).toHaveBeenCalledWith('client-123', expect.objectContaining(updateData));
      expect(result).toEqual(updatedClient);
      expect(result.firstName).toBe('Updated John');
      expect(result.price).toBe('2000');
    });

    it('should throw 404 when client not found for update', async () => {
      (repo.findClientById as jest.Mock).mockResolvedValue(null);

      const updateData = { firstName: 'Updated' };

      const error = await service.updateClientService('non-existent', updateData).catch(e => e);
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Client not found');
      expect(repo.findClientById).toHaveBeenCalledWith('non-existent');
      expect(repo.updateClientById).not.toHaveBeenCalled();
    });

    it('should handle date updates properly', async () => {
      const updatedClient = { ...mockClient, dob: new Date('1985-05-15') };
      (repo.findClientById as jest.Mock).mockResolvedValue(mockClient);
      (repo.updateClientById as jest.Mock).mockResolvedValue(updatedClient);

      const result = await service.updateClientService('client-123', {
        dob: '1985-05-15',
      });

      expect(repo.updateClientById).toHaveBeenCalledWith('client-123', expect.objectContaining({
        dob: expect.any(Date),
      }));
      expect(new Date(result.dob).toISOString().split('T')[0]).toBe('1985-05-15');
    });
  });

  describe('deleteClientService', () => {
    it('should delete client successfully', async () => {
      (repo.findClientById as jest.Mock).mockResolvedValue(mockClient);
      (repo.deleteClientById as jest.Mock).mockResolvedValue(undefined);

      await expect(service.deleteClientService('client-123')).resolves.toBeUndefined();

      expect(repo.findClientById).toHaveBeenCalledWith('client-123');
      expect(repo.deleteClientById).toHaveBeenCalledWith('client-123');
    });

    it('should throw 404 when client not found for delete', async () => {
      (repo.findClientById as jest.Mock).mockResolvedValue(null);

      const error = await service.deleteClientService('non-existent').catch(e => e);
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Client not found');
      expect(repo.findClientById).toHaveBeenCalledWith('non-existent');
      expect(repo.deleteClientById).not.toHaveBeenCalled();
    });
  });
});