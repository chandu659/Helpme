#include <iostream>
#include <iomanip>
#include <cstdlib>
#include <mpi.h>

#define MASTER 0
#define SEED 35791246

using namespace std;

int main(int argc, char **argv) {
    int nprocs, rank, npoints, circle_count = 0, total_circle_count = 0;
    double x, y, pi, stime, etime;

    
    MPI_Init(&argc, &argv);
    MPI_Comm_size(MPI_COMM_WORLD, &nprocs);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);

    if (rank == MASTER) {
        stime = MPI_Wtime(); 
    }

    
    npoints = 10000000; 
    if (argc >= 2)
        npoints = atoi(argv[1]);

    
    int base_points = npoints / nprocs;
    int extra_points = npoints % nprocs;
    int my_points = rank < extra_points ? base_points + 1 : base_points;

    srand(SEED + rank); 

    
    for (int i = 0; i < my_points; i++) {
        x = double(rand()) / RAND_MAX * 2 - 1;
        y = double(rand()) / RAND_MAX * 2 - 1;
        if (x * x + y * y <= 1) circle_count++;
    }

    
    MPI_Reduce(&circle_count, &total_circle_count, 1, MPI_INT, MPI_SUM, MASTER, MPI_COMM_WORLD);

    if (rank == MASTER) {
        
        pi = 4.0 * total_circle_count / npoints;
        etime = MPI_Wtime(); 

        cout << "  " << setw(10) << "npoints"
             << "  " << setw(10) << "pi"
             << "  " << setw(10) << "nprocs"
             << "  " << setw(30) << "elapsed wall-clock time" << "\n";
        cout << "  " << setw(10) << npoints
             << "  " << setw(10) << setprecision(6) << pi
             << "  " << setw(10) << nprocs
             << "  " << setw(30) << etime - stime << " seconds\n";
    }

    
    MPI_Finalize();

    return 0;
}
